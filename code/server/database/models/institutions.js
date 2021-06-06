const mongoose = require('mongoose')

const scheduleHelpers = require($rootDir + '/libraries/schedules/main.js')
const cloudStorageHelpers = require($rootDir + '/libraries/cloudStorage/main.js')

const { thirdPartyServicesConfig } = require($rootDir + '/Server.config.js')

const authorizations = require($rootDir + "/database/models/authorizations.js")
const users = require($rootDir + "/database/models/users.js")
const locations = require($rootDir + "/database/models/locations.js")
const timings = require($rootDir + "/database/models/timings.js")
const userScheduleRestrictions = require($rootDir + "/database/models/userScheduleRestrictions.js")
const announcements = require($rootDir + "/database/models/announcements.js")
const jummahPreferences = require($rootDir + "/database/models/jummahPreferences.js")

const institution = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1
    },
    abbreviatedName: {
        type: String,
        required: true,
        minlength: 1
    },
    timezone: {
        type: String,
        required: true,
        minLength: 1
    },
    confirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    country: {
        type: String,
        required: true,
        minLength: 1
    },
    state: {
        type: String,
        required: false,
        minLength: 1,
        default: $config.consts.nullId
    },
    settings: {
        autoConfirmRegistration: {
            type: Boolean,
            required: false,
            default: false
        },
        allowJummahSignup: {
            type: Boolean,
            required: false,
            default: true
        },
        allowJummahNotifications: {
            type: Boolean,
            required: false,
            default: true
        },
        jummahNotificationsTiming : {
            hour: {
                type: Number,
                required: false,
                default: 6,
                min: 0,
                max: 23
            },
            minute: {
                type: Number,
                required: false,
                default: 0,
                min: 0,
                max: 59
            },
            dayOfWeek: {
                type: Number,
                required: false,
                default: 3,
                min: 0,
                max: 6
            }
        }
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    }
},
{ timestamps: true, minimize: false })

institution.post('save', async function(institution) {
    console.log(`Created institution ${institution.name} with id:`, institution._id)
    await institution.createStandardAuthorizations()
})

institution.methods.createStandardAuthorizations = async function() {
    const standardAuthorizationRoles = ['khateeb', 'institutionAdmin', 'rootInstitutionAdmin']
    const id = this._id.toString()
    for (const role of standardAuthorizationRoles) {
        try {
            const auth = await new authorizations({ institution: id, role }).save()
            console.log(`created authorization ${auth.role} ${auth._id}`)
        } catch(err) {
            console.error(`Couldn't create standard authorizations for ${this.name} `, err)
        }
    }
}

institution.methods.deactivate = async function() {
    const res = {}
    res.directDependencies = await this.deleteDirectDependencies()
    res.logo = await this.deleteInstitutionLogo()
    const authorizationKeys = await this.getAuthorizationKeys()
    try {
        // In the case that users with authorization keys aren't correctly deleted
        // I want to keep the authorization keys so that they can at least be
        // manually deleted, or programmatically by a cron script
        res.userAuth = await this.removeAuthorizationKeysFromUsers(authorizationKeys)
        res.authKeys = await this.deleteAuthorizationKeys()
    } catch(err) {
        console.error(err)
    }
    return res
}

institution.methods.deleteInstitutionLogo = async function() {
    const res = await cloudStorageHelpers.deleteFile(`${thirdPartyServicesConfig.AWS.cloudSubDirectories.logos}${this._id}`)
    return res
}

institution.methods.deleteAuthorizationKeys = async function() {
    let res = {}
    try {
        res = await authorizations.deleteMany({ institution: this._id })
    } catch(err) {
        console.error(err)
    }
    return res
}

institution.methods.removeAuthorizationKeysFromUsers = async function(authKeys=[]) {
    try {
        const res = await users
            .update(
                {},
                {
                    $pull: { 
                        "authorizations": {
                            authId: { $in: authKeys }
                        }
                    }
                },
                { multi: true }
            )
        return res
    } catch(err) {
        console.error(`couldn't remove user with authorization keys`, err)
        throw new Error(err)
    }
}

institution.methods.getAuthorizationKeys = async function() {
    let res = []
    try {
        const auths = await authorizations
            .find({ institution: this._id })
            .exec()
        res = auths.map(a => a._id)
    } catch(err) {
        console.error(err)
    }
    return res
}

const directDependenciesList = [
    { name: "locations", key: "institutionID", model: locations },
    { name: "timings", key: "institutionID", model: timings },
    { name: "jummahPreferences", key: "institutionID", model: userScheduleRestrictions },
    { name: "userScheduleRestrictions", key: "institution", model: jummahPreferences },
    { name: "announcements", key: "institutionID", model: announcements },
]
institution.methods.deleteDirectDependencies = async function() {
    const res = {}
    for (const dependency of directDependenciesList) {
        res[dependency.name] = await this.deleteTargetDependency(dependency.model, dependency.key)
    }
    return res
}


// "institutionReferenceKey" is taken a input for legacy reasons
institution.methods.deleteTargetDependency = async function(targetModel={}, institutionReferenceKey="institutionID") {
    let res = {}
    try {
        const query = {}
        query[institutionReferenceKey] = this._id
        res = await targetModel.deleteMany(query).exec()
    } catch(err) {
        console.error(err)
    }
    return res
}

institution.methods.getLocalTime = function () {
    return scheduleHelpers.getDateInTimezoneNow(this.timezone)
}

module.exports = mongoose.model('institution', institution)
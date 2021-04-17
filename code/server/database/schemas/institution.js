const mongoose = require('mongoose')

const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const scripts = require(global.$dir + '/libraries/scripts/main.js')

const institution = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1
    },
    abbreviatedName: {
        type: String,
        required: false,
        default: '__NO-ABBREVIATED-NAME__'
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
        minLength: 1
    },
    settings: {
        textAPIInfo: {
            type: Object,
            required: false
        },
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
    }
},
{ timestamps: true, minimize: false })

institution.post('save', function(institution) {
    console.log(`Created institution ${institution.name} with id:`, institution._id)
})

institution.methods.deleteDependencies = async function() {
    const deleteRes = {}
    try {
        const models = Object.keys($db)
        for (let i = 0; i < models.length; i++) {
            const model = models[i]
            if (model === 'institutions')
                continue
            deleteRes[model] = await $db[model].deleteMany({ institutionID: this._id.toString() })
        }
    } catch(err) {
        console.log(err)
    }
    return deleteRes
}

institution.methods.createRootAdministrator = async function(administratorInfo) {
    administratorInfo.institutionID = this._id.toString()
    try {
        const adminEntry = await new $db.rootInstitutionAdmins(administratorInfo).save()
        console.log(`Created root institution admin for inst:${this.name} (id: ${adminEntry._id})`)
        return adminEntry
    } catch(err) {
        console.log(err)
    }
}

institution.methods.createRootSystemAdmin = async function(administratorInfo) {
    try {
        if (this.name !== '__ROOT__')
            throw TypeError(`Cannot create root system admin`)
        const adminEntry = await new $db.root(administratorInfo).save()
        console.log(`Created root sys admin (inst:${this.name}) (id: ${adminEntry._id})`)
        return adminEntry
    } catch(err) {
        console.log(err)
    }
}

institution.methods.confirmRootAdmin = async function() {
    try {
        const updated = await $db.rootInstitutionAdmins.findOneAndUpdate({ institutionID: this._id.toString() }, { confirmed: true }, { new: true }).exec()
        return updated
    } catch(err) {
        console.log(err)
    }
}

institution.methods.getLocalTime = function () {
    return scheduleHelpers.getDateInTimezoneNow(this.timezone)
}

institution.post('deleteOne', async function(institution) {
    if (institution.name === '__ROOT__')
        await scripts.createRootInstitutionAndUser()
    else if (institution.name === '__TEST__')
        await scripts.createTestInstitution()
})

module.exports = institution
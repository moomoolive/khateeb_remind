const mongoose = require('mongoose')

const databaseHelpers = require($rootDir + '/database/helperFunctions/main.js')

const authorizations = require($rootDir + "/database/models/authorizations.js")

const defaultKhateebForWeek = new mongoose.Schema({
    mainKhateeb: {
        type: String,
        required: true,
        minLength: 1
    },
    backup: {
        type: String,
        required: true,
        minLength: 1
    },
}, { timestamps: true })

const defaultKhateebsDefaultValue = new Array(5).fill(
    { mainKhateeb: $config.consts.nullId, backup: $config.consts.nullId }
)

const timing = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    locationID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'location'
    },
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    minute: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    defaultKhateebs: {
        type: [defaultKhateebForWeek],
        required: false,
        default: () => defaultKhateebsDefaultValue,
        validate: {
            validator: function(t) {
                return t.length === defaultKhateebsDefaultValue.length
            },
            message: t => `Default khateebs array must have five entries. Got ${t.length}`
        }
    }
}, { timestamps: true })


timing.methods.deleteDependants = async function() {
    const res = {}
    try {
        const timingID = this._id.toString()
        const khateebAuthorization = await authorizations
            .findOne({ 
                institution: this.institutionID,
                role: 'khateeb'
            })
            .exec()
        if (!khateebAuthorization) {
            throw TypeError(`Khateeb Authorization doesn't exist`)
        }
        const khateebs =await databaseHelpers.getKhateebs(
            this.institutionID, 
            khateebAuthorization, 
            { active: true }
        )
        for (let i = 0; i < khateebs.length; i++) {
            const khateeb = khateebs[i]
            const availableTimings = khateeb.availableTimings.filter(timing => timing !== timingID)
            const khateebTimingRes = await $db.users.updateOne(
                { _id: khateeb._id }, 
                { availableTimings }
            )
            if (!res.khateebs)
                res.khateebs = khateebTimingRes
            else
                res.khateebs.n++; res.khateebs.nModified++;
        }
        if (!res.khateebs)
            res.khateebs = `None modified`
    } catch(err) {
        console.error(`Couldn't delete dependant data structures`, err)
    }
    return res
}

timing.query.activeTimings = function(institutionID='none') {
    institutionID = institutionID.toString()
    if (!institutionID || institutionID.toLowerCase() === $config.consts.nullId)
        throw TypeError(`please provide a valid institution id`)
    return this.where({ active: true, institutionID })
}

module.exports = mongoose.model('timing', timing)
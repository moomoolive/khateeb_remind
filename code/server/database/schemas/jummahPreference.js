const mongoose = require('mongoose')

const validationHelpers = require(global.$dir + "/libraries/validation/main.js")

const jummahPreference = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'institution'
    },
    date: {
        type: Date,
        required: true
    },
    locationID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'location'
    },
    timingID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'timing'
    },
    khateebID: {
        type: String,
        required: true,
        validate: {
            validator: validationHelpers.validIdOrNullId,
            message: id => `${id} is an invalid format for an ids` 
        },
        ref: 'khateeb'
    },
    notified: {
        type: Boolean,
        required: false,
        default: false
    },
    isBackup: {
        type: Boolean,
        required: true
    },
    isGivingKhutbah: {
        type: Boolean,
        required: true
    },
    notificationID: {
        type: String,
        required: false,
        validate: {
            validator: validationHelpers.validIdOrNullId,
            message: id => `${id} is an invalid format for an ids` 
        },
        default: 'none',
        ref: 'notification'
    },
    loopRunCount: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    }
}, { timestamps: true })

jummahPreference.methods.gatherMeta = async function() {
    try {
        const location = await $db.locations.findOne({ _id: this.locationID }).exec()
        const timing = await $db.timings.findOne({ _id: this.timingID }).exec()
        return {
            location,
            timing
        } 
    } catch(err) {
        console.log(err)
        console.log(`Couldn't gather jummah meta`)
    }
}

jummahPreference.query.upcomingJummahsForInstitution = function (date=new Date(), institutionID='none') {
    institutionID = institutionID.toString()
    if (!institutionID || institutionID === 'none')
        throw TypeError(`You must provide a valid institution id`)
    return this.where({
        institutionID,
        date,
        khateebID: { $ne: 'none' }
    })
}

module.exports = jummahPreference
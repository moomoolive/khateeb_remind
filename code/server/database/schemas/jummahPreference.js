const mongoose = require('mongoose')

const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const timings = require($rootDir + "/database/interfaces/timings.js")
const locations = require($rootDir + "/database/interfaces/locations.js")

const jummahPreference = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    date: {
        type: Date,
        required: true
    },
    locationID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'location'
    },
    timingID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'timing'
    },
    khateebID: {
        type: String,
        required: true,
        validate: {
            validator: typeCheckingHelpers.validIdOrNullId,
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
            validator: typeCheckingHelpers.validIdOrNullId,
            message: id => `${id} is an invalid format for an ids` 
        },
        default: $config.consts.nullId,
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
        const locationQuery = await locations.query({ filter: { _id: this.locationID } })
        const timingQuery = await timings.query({ filter: { _id: this.timingID } })
        return {
            location: locationQuery[0],
            timing: timingQuery[0]
        } 
    } catch(err) {
        console.log(err)
        console.log(`Couldn't gather jummah meta`)
    }
}

jummahPreference.query.upcomingJummahsForInstitution = function (date=new Date(), institutionID='none') {
    institutionID = institutionID.toString()
    if (!institutionID || institutionID === $config.consts.nullId)
        throw TypeError(`You must provide a valid institution id`)
    return this.where({
        institutionID,
        date,
        khateebID: { $ne: $config.consts.nullId }
    })
}

module.exports = jummahPreference
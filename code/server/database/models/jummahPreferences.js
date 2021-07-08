const mongoose = require('mongoose')

const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const timings = require($rootDir + "/database/models/timings.js")
const locations = require($rootDir + "/database/models/locations.js")

const jummahPreference = new mongoose.Schema({
    institutionID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'institution'
    },
    date: {
        type: Date,
        required: true
    },
    locationID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'location'
    },
    timingID: {
        type: mongoose.Types.ObjectId,
        required: true,
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
        const locationQuery = await locations.find({ _id: this.locationID }).exec()
        const timingQuery = await timings.find({ _id: this.timingID }).exec()
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
    if (!institutionID || institutionID === $config.consts.nullId) {
        throw TypeError(`You must provide a valid institution id`)
    } else {
        return this.where({
            institutionID,
            date,
            khateebID: { $ne: $config.consts.nullId }
        })
    }
}

module.exports = mongoose.model('jummahPreference', jummahPreference)
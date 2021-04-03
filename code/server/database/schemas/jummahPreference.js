const mongoose = require('mongoose')

const jummahPreference = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    locationID: {
        type: String,
        required: true
    },
    timingID: {
        type: String,
        required: true
    },
    khateebID: {
        type: String,
        required: true
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
        default: 'none'
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
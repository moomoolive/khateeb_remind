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
        required: true
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
        required: true
    }
}, { timestamps: true })

module.exports = jummahPreference
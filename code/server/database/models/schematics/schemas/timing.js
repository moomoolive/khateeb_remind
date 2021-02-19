const mongoose = require('mongoose')

const timing = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    locationID: {
        type: String,
        required: true
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
    }
}, { timestamps: true })

module.exports = timing
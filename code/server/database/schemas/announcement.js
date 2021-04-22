const mongoose = require('mongoose')

const announcement = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: global.APP_CONFIG.consts.mongooseIdLength,
        maxLength: global.APP_CONFIG.consts.mongooseIdLength,
        ref: 'institution'
    },
    headline: {
        type: String,
        required: true,
        minLength: 1
    },
    content: {
        type: String,
        required: true,
        minLength: 1
    },
    important: {
        type: Boolean,
        required: false,
        default: false
    },
    urgent: {
        type: Boolean,
        required: false,
        default: false
    },
}, { timestamps: true })

module.exports = announcement
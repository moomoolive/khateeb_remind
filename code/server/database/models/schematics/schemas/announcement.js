const mongoose = require('mongoose')

const announcement = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
        minlength: 1
    },
    content: {
        type: String,
        default: 'no content',
        minlength: 1
    },
    important: {
        type: Boolean,
        default: false
    },
    urgent: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

module.exports = announcement
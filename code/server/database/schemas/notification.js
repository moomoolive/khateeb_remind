const mongoose = require('mongoose')

const notification = new mongoose.Schema({
    institutionID: {
        type: String,
        required: false,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    userID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'user'
    },
    msg: {
        type: String,
        required: true,
        minLength: 1
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date,
        required: false
    },
    tag: {
        type: String,
        required: true
    },
    urgent: {
        type: Boolean,
        required: false,
        default: false
    },
    meta: {
        type: Object,
        required: false,
        default: () => {}
    }
}, { timestamps: true, minimize: false })

module.exports = notification
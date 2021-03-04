const mongoose = require('mongoose')

const notification = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true,
        minlength: 1
    },
    msg: {
        type: String,
        required: true,
        minlength: 1
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
    meta: {
        type: Object,
        required: true
    }
}, { timestamps: true })

module.exports = notification
const mongoose = require('mongoose')

const defaultKhateebForWeek = new mongoose.Schema({
    mainKhateeb: {
        type: String,
        required: true,
        minLength: 1
    },
    backup: {
        type: String,
        required: true,
        minLength: 1
    },
}, { timestamps: true })

const unavailableDate = new mongoose.Schema({
    vCalendarId: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const individualPWASubscription = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength
    },
    browserSubscriptionDetails: {
        type: Object,
        required: true
    },
    deviceType: {
        type: String,
        required: true,
        minLength: 1
    },
    deviceBrand: {
        type: String,
        required: true,
        minLength: 1
    },
    browserBrand: {
        type: String,
        required: true,
        minLength: 1
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true, _id: false })

module.exports = {
    unavailableDate,
    defaultKhateebForWeek,
    individualPWASubscription
}


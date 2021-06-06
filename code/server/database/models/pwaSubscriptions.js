const mongoose = require('mongoose')

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

const pwaSubscription = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'user'
    },
    subscriptions: {
        type: [individualPWASubscription],
        required: false,
        default: () => []
    },
}, { timestamps: true })

module.exports = mongoose.model('pwaSubscription', pwaSubscription)
const mongoose = require('mongoose')

const subDocs = require($rootDir + "/database/subDocuments/main.js")

const pwaSubscription = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
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
    subscriptions: {
        type: [subDocs.individualPWASubscription],
        required: false,
        default: () => []
    },
}, { timestamps: true })


module.exports = pwaSubscription
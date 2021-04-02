const mongoose = require('mongoose')

const subDocs = require(global.$dir + "/database/subDocuments/main.js")

const pwaSubscription = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: global.APP_CONFIG.consts.mongooseIdLength,
        maxLength: global.APP_CONFIG.consts.mongooseIdLength
    },
    userID: {
        type: String,
        required: true,
        minLength: global.APP_CONFIG.consts.mongooseIdLength,
        maxLength: global.APP_CONFIG.consts.mongooseIdLength
    },
    subscriptions: {
        type: [subDocs.individualPWASubscription],
        required: false,
        default: () => []
    },
}, { timestamps: true })


module.exports = pwaSubscription
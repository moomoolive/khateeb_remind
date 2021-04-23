const mongoose = require('mongoose')

const subDocs = require(global.$dir + "/database/subDocuments/main.js")

const pwaSubscription = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'institution'
    },
    userID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'user'
    },
    subscriptions: {
        type: [subDocs.individualPWASubscription],
        required: false,
        default: () => []
    },
}, { timestamps: true })


module.exports = pwaSubscription
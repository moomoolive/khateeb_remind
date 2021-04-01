const mongoose = require('mongoose')

const pwaSubscription = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minlength: global.APP_CONFIG.consts.mongooseIdLength,
        maxlength: global.APP_CONFIG.consts.mongooseIdLength
    },
    userID: {
        type: String,
        required: true,
        minlength: global.APP_CONFIG.consts.mongooseIdLength,
        maxlength: global.APP_CONFIG.consts.mongooseIdLength
    },
    subscriptions: {
        type: [Object],
        required: false,
        default: () => []
    },
}, { timestamps: true })


module.exports = pwaSubscription
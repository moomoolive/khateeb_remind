const mongoose = require('mongoose')

const mathHelpers = require(global.$dir + '/libraries/math/main.js')

const verificationCode = new mongoose.Schema({
    code: {
        type: String,
        required: false,
        minLength: 11,
        maxLength: 11
    },
    userID: {
        type: String,
        required: true,
        minLength: global.APP_CONFIG.consts.mongooseIdLength,
        maxLength: global.APP_CONFIG.consts.mongooseIdLength,
        ref: 'user'
    }
}, { timestamps: true })

verificationCode.pre('save', function(next) {
    this.code = "KR-" + mathHelpers.generateRandomNumber(6)
    next()
})

module.exports = verificationCode
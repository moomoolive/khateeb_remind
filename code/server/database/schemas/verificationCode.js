const mongoose = require('mongoose')

const mathHelpers = require($rootDir + '/libraries/math/main.js')

const fifteenMinutes = "15m"

const verificationCode = new mongoose.Schema({
    code: {
        type: String,
        required: false,
        minLength: 11,
        maxLength: 11
    },
    username: {
        type: String,
        required: true,
        minlength: 6
    },
    // verification codes automatically deleted after
    // 15 minutes
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: fifteenMinutes }
    }
}, { timestamps: true })

verificationCode.pre('save', function(next) {
    this.code = "KR-" + mathHelpers.generateRandomNumber(6)
    next()
})

module.exports = verificationCode
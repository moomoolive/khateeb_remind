const mongoose = require('mongoose')

const nanoId = require('nanoid')

const verificationCode = new mongoose.Schema({
    code: {
        type: String,
        required: false,
        minlength: 11,
        maxlength: 11
    },
    userID: {
        type: String,
        required: true
    }
}, { timestamps: true })

verificationCode.pre('save', function(next) {
    this.code = "KR-" + nanoId.nanoid(8)
    next()
})

module.exports = verificationCode
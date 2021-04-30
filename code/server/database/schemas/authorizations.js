const mongoose = require('mongoose')

const authorization = new mongoose.Schema({
    institution: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    role: {
        type: String,
        required: true,
        minlength: 1
    }
}, { timestamps: true })

module.exports = authorization
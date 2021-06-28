const mongoose = require('mongoose')

const restToken = new mongoose.Schema({
    institution: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    tag: {
        type: String,
        required: false,
        default: "default tag"
    }
}, { timestamps: true })

module.exports = mongoose.model("restToken", restToken)
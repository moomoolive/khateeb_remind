const mongoose = require('mongoose')

const restToken = new mongoose.Schema({
    institution: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'institution'
    },
    tag: {
        type: String,
        required: false,
        default: "default tag"
    }
}, { timestamps: true })

module.exports = mongoose.model("restToken", restToken)
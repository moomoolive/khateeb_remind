const mongoose = require('mongoose')

const nanoId = require('nanoid')

const shortenedURL = new mongoose.Schema({
    longURL: {
        type: String,
        required: true
    },
    shortURLCode: {
        type: String,
        required: false
    },
}, { timestamps: true })

shortenedURL.pre('save', function(next) {
    this.shortURLCode = nanoId.nanoid(10)
    next()
})

module.exports = shortenedURL
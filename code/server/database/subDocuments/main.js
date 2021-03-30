const mongoose = require('mongoose')

const defaultKhateebForWeek = new mongoose.Schema({
    mainKhateeb: {
        type: String,
        required: true,
        minlength: 1
    },
    backup: {
        type: String,
        required: true,
        minlength: 1
    },
}, { timestamps: true })

const unavailableDate = new mongoose.Schema({
    vCalendarId: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

module.exports = {
    unavailableDate,
    defaultKhateebForWeek
}


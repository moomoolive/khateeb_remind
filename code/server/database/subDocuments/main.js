const mongoose = require('mongoose')

module.exports = {
    prayerSlot: new mongoose.Schema({
        notified: {
            type: Boolean,
            required: true
        },
        confirmed: {
            type: Boolean,
            required: true
        },
        responded: {
            type: Boolean,
            required: true
        },
        khateebID: {
            type: String,
            required: true
        }
    }, { timestamps: true }),
    unavailableDate: new mongoose.Schema({
        vCalendarId: {
            type: String,
            required: true
        }, 
        date: {
            type: Date,
            required: true
        }
    }, { timestamps: true })
}


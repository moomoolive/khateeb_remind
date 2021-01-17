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
    })
}


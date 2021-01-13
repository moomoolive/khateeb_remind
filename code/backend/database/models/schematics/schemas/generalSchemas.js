const mongoose = require('mongoose')

module.exports = {
    scheduleEntry: new mongoose.Schema({
        month: String,
        data: Object,
        savedOn: Date
    }),
    khateeb: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        title: String,
        active: Boolean,
        dropouts: Number,
        savedOn: Date
    }),
    announcement: new mongoose.Schema({
        headline: String,
        content: String,
        important: Boolean,
        urgent: Boolean,
        savedOn: Date
    }),
    location: new mongoose.Schema({
        info: Object,
        monthlySchedule: Object
    }),
    prayerSlot: new mongoose.Schema({
        _id: String,
        firstName: String,
        lastName: String,
        savedOn: Date
    }),
    textHub: new mongoose.Schema({
        notified: Boolean,
        timezone: String,
        finished: Boolean,
        weekOf: Date,
        data: [
            {
                info: {
                    address: String,
                    name: String
                },
                prayers: {
                    timings: [Date],
                    khateebs: [Object]
                }
            }
        ]
    })
}
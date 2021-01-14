const mongoose = require('mongoose')

const subDocs = require('./subDocs.js')

module.exports = {
    scheduleEntry: new mongoose.Schema({
        month: {
            type: String,
            default: 'January-2021'
        },
        notified: {
            type: Boolean,
            default: false
        },
        data: [subDocs.locationTemplate],
        savedOn: Date
    }),
    khateeb: new mongoose.Schema({
        firstName: {
            type: String,
            default: 'TBD'
        },
        lastName: {
            type: String,
            default: ''
        },
        phoneNumber: {
            type: String,
            default: '0000000000'
        },
        title: {
            type: String,
            default: 'none'
        },
        active: {
            type: Boolean,
            default: true
        },
        dropouts: {
            type: Number,
            default: 0
        },
        savedOn: Date
    }),
    announcement: new mongoose.Schema({
        headline: {
            type: String,
            default: 'No headline'
        },
        content: {
            type: String,
            default: 'no content'
        },
        important: {
            type: Boolean,
            default: false
        },
        urgent: {
            type: Boolean,
            default: false
        },
        savedOn: Date
    }),
    location: new mongoose.Schema({
        info: Object,
        monthlySchedule: Object
    }),
    prayerSlot: new mongoose.Schema({
        timing: String,
        data: {
            firstName: {
                type: String,
                default: 'TBD'
            },
            lastName: {
                type: String,
                default: ' '
            },
            title: {
                type: String,
                default: 'none'
            }
        },
        confirm: {
            state: {
                type: Boolean,
                default: false
            },
            responded: {
                type: Boolean,
                default: false
            }
        },
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
const mongoose = require('mongoose')

const subDocs = require('./subDocs')

module.exports = {
    jummah: new mongoose.Schema({
        institutionID: {
            type: String,
            required: true,
            default: 'TBD'
        },
        month: {
            type: Number,
            required: true,
            default: 0
        },
        year: {
            type: Number,
            required: true,
            default: 2021
        },
        weekOf: {
            type: Number,
            required: true,
            default: 15
        },
        confirmed: {
            type: Boolean,
            required: true,
            default: false
        },
        locationID: {
            type: String,
            required: true,
            default: 'TBD'
        },
        timingID: {
            type: String,
            required: true,
            default: 'TBD'
        },
        khateebPreference: [subDocs.prayerSlot],
        savedOn: {
            type: Date,
            required: false
        }
    }),
    institution: new mongoose.Schema({
        name: {
            type: String,
            required: true,
            default: 'Unknown Institution'
        },
        abbreviatedName: {
            type: String,
            required: true,
            default: 'UNK'
        },
        timezone: {
            type: String,
            required: true,
            default: 'America/Edmonton'
        },
        confirmed: {
            type: Boolean,
            required: true,
            default: false
        },
        country: {
            type: String,
            required: false,
            default: 'canada'
        },
        state: {
            type: String,
            required: false,
            default: 'alberta'
        }
    },
    { timestamps: true }),
    location: new mongoose.Schema({
        institutionID: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: 'Unknown Institution',
        },
        address: {
            type: String,
            default: 'Unknown Address'
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        savedOn: {
            type: Date,
            required: true,
            default: new Date()
        }
    }),
    timing: new mongoose.Schema({
        institutionID: {
            type: String,
            required: true
        },
        locationID: {
            type: String,
            required: true
        },
        hour: {
            type: Number,
            required: true,
            default: 11
        },
        minutes: {
            type: Number,
            required: true,
            default: 30
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        savedOn: {
            type: Date,
            required: true,
            default: new Date()
        }
    }),
    user: new mongoose.Schema({
        institutionID: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: false,
            default: 'password'
        },
        confirmed: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }),
    profile: new mongoose.Schema({
        userID: {
            type: String,
            required: true,
            default: 'TBD'
        },
        institutionID: {
            type: String,
            required: true,
            default: 'TBD'
        },
        handle: {
            type: String,
            required: false,
            default: "__NOHANDLE__"
        },
        firstName: {
            type: String,
            required: true,
            default: 'no first name'
        },
        lastName: {
            type: String,
            required: true,
            default: 'no last name'
        },
        phoneNumber: {
            type: Number,
            required: true,
            default: 0000000000
        }
    }, { timestamps: true }),

    // old schemas
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
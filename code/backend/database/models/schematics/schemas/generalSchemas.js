const mongoose = require('mongoose')

const subDocs = require('./subDocs')

module.exports = {
    jummah: new mongoose.Schema({
        institutionID: {
            type: String,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        weekOf: {
            type: Number,
            required: true,
        },
        confirmed: {
            type: Boolean,
            required: true
        },
        locationID: {
            type: String,
            required: true
        },
        timingID: {
            type: String,
            required: true
        },
        khateebPreference: [subDocs.prayerSlot]
    }, { timestamps: true }),
    institution: new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        abbreviatedName: {
            type: String,
            required: false,
            default: '__NOABBREVIATEDNAME__'
        },
        timezone: {
            type: String,
            required: true
        },
        confirmed: {
            type: Boolean,
            required: false,
            default: false
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: false
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
            required: true
        },
        address: {
            type: String,
            required: false,
            default: 'Unknown Address'
        },
        active: {
            type: Boolean,
            required: false,
            default: true
        }
    }, { timestamps: true }),
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
            required: true
        },
        minute: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            required: false,
            default: true
        }
    }, { timestamps: true }),
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
            default: 'password'
        },
        confirmed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }),
    profile: new mongoose.Schema({
        userID: {
            type: String,
            required: true
        },
        institutionID: {
            type: String,
            required: true,
        },
        handle: {
            type: String,
            required: false,
            default: "__NOHANDLE__"
        },
        firstName: {
            type: String,
            required: false,
            default: 'no first name'
        },
        lastName: {
            type: String,
            required: false,
            default: 'no last name'
        },
        phoneNumber: {
            type: Number,
            required: true
        }
    }, { timestamps: true }),
    announcement: new mongoose.Schema({
        institutionID: {
            type: String,
            required: true,
        },
        headline: {
            type: String,
            required: true
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
    }, { timestamps: true }),
}
const mongoose = require('mongoose')

const subDocs = require('./subDocs')

const jummah = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    // deprecated, have not been removed for backward compatiblity
    month: {
        type: Number,
        required: false,
        min: 0,
        max: 11
    },
    year: {
        type: Number,
        required: false,
        min: 2021
    },
    weekOf: {
        type: Number,
        required: false,
        min: 1,
        max: 31
    },
    // ENDS HERE 
    date: {
        type: Date,
        required: true
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
}, { timestamps: true })

jummah.methods.gatherMeta = async function() {
    try {
        const location = await $db.models.locations.findOne({ _id: this.locationID }).exec()
        const timing = await $db.models.timings.findOne({ _id: this.timingID }).exec()
        return {
            location,
            timing
        } 
    } catch(err) {
        console.log(err)
        console.log(`Couldn't gather jummah meta`)
    }
}

jummah.methods.gatherScheduleComponents = async function () {
    try {
        const query = { institutionID: this.institutionID }
        const removedFields = ['-username', '-password', '-phoneNumber', '-lastLogin']
        const locations = await $db.models.locations.find(query).exec()
        const timings = await $db.models.timings.find(query).exec()
        const khateebs = await $db.models.khateebs.find(query).select(removedFields).exec()
        return {
            locations,
            timings,
            khateebs
        }
    } catch(err) {
        console.log(err)
        console.log(`Couldn't gather schedule components`)
    }
}

jummah.query.monthlyEntries = function (year, month) {
    const greaterThanOrEqual = new Date(`${year}-${parseInt(month) + 1}-1`)
    // all jummahs date hours are set to 12PM UTC >> see jummah utils for
    // more info
    greaterThanOrEqual.setUTCHours(12, 0, 0, 0)
    console.log(greaterThanOrEqual.toISOString())
    const lesserThan = new Date(greaterThanOrEqual)
    lesserThan.setMonth(lesserThan.getMonth() + 1)
    return this.where({ date: { $gte: greaterThanOrEqual, $lt: lesserThan } })
}

module.exports = jummah
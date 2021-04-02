// DEPRECATED SCHEMA
/*
const mongoose = require('mongoose')

const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const subDocs = require(global.$dir + '/database/subDocuments/main.js')

const jummah = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
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
        const location = await $db.locations.findOne({ _id: this.locationID }).exec()
        const timing = await $db.timings.findOne({ _id: this.timingID }).exec()
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
        const locations = await $db.locations.find(query).exec()
        const timings = await $db.timings.find(query).exec()
        const khateebs = await $db.khateebs.find(query).select(removedFields).exec()
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
    const lesserThan = new Date(greaterThanOrEqual)
    lesserThan.setMonth(lesserThan.getMonth() + 1)
    return this.where({ date: { $gte: greaterThanOrEqual, $lt: lesserThan } })
}

jummah.query.futureEntries = function() {
    const upcomingFriday = scheduleHelpers.findUpcomingFriday()
    return this.where({ date: { $gte: `${upcomingFriday.year()}-${upcomingFriday.month() + 1}-${upcomingFriday.date()}` } })
}

module.exports = jummah
*/
// this file acts as the khateebs remind's database
// public interface
const announcements = require("./interfaces/announcements.js")
const locations = require("./interfaces/locations.js")
const timings = require('./interfaces/timings.js')
const institutions = require("./interfaces/institutions.js")
const notifications = require("./interfaces/notifications.js")

module.exports = {
    announcements,
    locations,
    timings,
    institutions,
    notifications
}
// this file acts as the khateebs remind's database
// public interface
const announcements = require("./interfaces/announcements.js")
const locations = require("./interfaces/locations.js")
const timings = require('./interfaces/timings.js')
const institutions = require("./interfaces/institutions.js")
const notifications = require("./interfaces/notifications.js")
const testInstitution = require("./interfaces/testInstitution.js")
const verificationCodes = require("./interfaces/verificationCodes.js")
const authorizations = require("./interfaces/authorizations.js")
const pwaSubscriptions = require("./interfaces/pwaSubscriptions.js")
const userScheduleRestrictions = require("./interfaces/userScheduleRestrictions.js")
const jummahPreferences = require("./interfaces/jummahPreferences.js")
const users = require("./interfaces/users.js")

module.exports = {
    announcements,
    locations,
    timings,
    institutions,
    notifications,
    testInstitution,
    verificationCodes,
    authorizations,
    pwaSubscriptions,
    userScheduleRestrictions,
    jummahPreferences,
    users
}
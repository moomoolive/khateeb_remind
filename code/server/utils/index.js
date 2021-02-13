const general = require('./funcs.js')
const auth = require('./auth/main.js')
const hCodes = require('./httpCodes.js')
const schedule = require('./schedules/main.js')
const notifications = require('./notifications.js')

module.exports = {
    ...general,
    auth,
    hCodes,
    schedule,
    notifications
}
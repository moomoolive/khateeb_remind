const general = require('./funcs.js')
const auth = require('./auth/main.js')
const schedule = require('./schedules/main.js')
const notifications = require('./notifications.js')

module.exports = {
    ...general,
    auth,
    schedule,
    notifications
}
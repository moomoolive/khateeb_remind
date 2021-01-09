const general = require('./funcs.js')
const schedule = require('./schedules/main.js')
const auth = require('./auth/main.js')
const hCodes = require('./httpCodes.js')
const text = require('./textHub/main.js')
const areaCodes = require('./areaCodes/main.js')

module.exports = {
    general,
    schedule,
    auth,
    hCodes,
    text,
    areaCodes
}
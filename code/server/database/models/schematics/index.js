const discriminators = require('./schemas/discriminators.js')
const jummah = require('./schemas/jummah.js')
const location = require('./schemas/location.js')
const institution = require('./schemas/institution.js')
const timing = require('./schemas/timing.js')
const user = require('./schemas/user.js')
const announcement = require('./schemas/announcement.js')
const setting = require('./schemas/setting.js')
const notification = require('./schemas/notification.js')
const shortenedURL = require('./schemas/shortenedURL.js')
const verificationCode = require('./schemas/verificationCode.js')

module.exports = {
    jummah,
    location,
    institution,
    timing,
    user,
    announcement,
    setting,
    notification,
    shortenedURL,
    verificationCode,
    discriminators
}
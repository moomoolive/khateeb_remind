const mongoose = require('mongoose')

const discriminators = require('./discriminators/main.js')
const location = require('./schemas/location.js')
const institution = require('./schemas/institution.js')
const timing = require('./schemas/timing.js')
const user = require('./schemas/user.js')
const announcement = require('./schemas/announcement.js')
const notification = require('./schemas/notification.js')
const verificationCode = require('./schemas/verificationCode.js')
const jummahPreference = require('./schemas/jummahPreference.js')
const pwaSubscription = require('./schemas/pwaSubscription.js')
const authorization = require('./schemas/authorizations.js')
const userScheduleRestriction = require('./schemas/userScheduleRestrictions.js')

const models = {
    institutions: mongoose.model('institution', institution),
    timings: mongoose.model('timing', timing),
    locations: mongoose.model('location', location),
    users: mongoose.model('user', user),
    announcements: mongoose.model('announcement', announcement),
    notifications: mongoose.model('notification', notification),
    verificationCodes: mongoose.model('verificationCode', verificationCode),
    jummahPreferences: mongoose.model('jummahPreference', jummahPreference),
    pwaSubscriptions: mongoose.model('pwaSubscription', pwaSubscription),
    authorizations: mongoose.model('authorization', authorization),
    userScheduleRestrictions: mongoose.model('userScheduleRestriction', userScheduleRestriction)
}

const userTypes = {
    root: models.users.discriminator('root', discriminators.root),
    sysAdmins: models.users.discriminator('sysAdmin', discriminators.sysAdmin),

    // legacy structures
    rootInstitutionAdmins: models.users.discriminator('rootInstitutionAdmin', discriminators.rootInstitutionAdmin),
    khateebs: models.users.discriminator('khateeb', discriminators.khateeb),
    institutionAdmins: models.users.discriminator('institutionAdmin', discriminators.institutionAdmin),
    // to be phased out
}

module.exports = { 
    ...models, 
    ...userTypes
}
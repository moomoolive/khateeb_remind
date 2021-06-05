const mongoose = require('mongoose')

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

// discriminators --> basically a schema that inherits and extends any of the
// above schemas

// users
const root = require('./discriminators/rootUser.js')
const sysAdmin = require('./discriminators/sysAdmin.js')

// institutions
const testInstitution = require('./discriminators/testInstitution.js')

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

const userDiscriminators = {
    root: models.users.discriminator('root', root),
    sysAdmins: models.users.discriminator('sysAdmin', sysAdmin),
}

const institutionDiscriminators = {
    testInstitution: models.institutions.discriminator('testInstitution', testInstitution)
}

module.exports = { 
    ...models, 
    ...userDiscriminators,
    ...institutionDiscriminators
}
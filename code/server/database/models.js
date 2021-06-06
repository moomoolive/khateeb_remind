const mongoose = require('mongoose')

const user = require('./schemas/user.js')
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

const models = {
    users: mongoose.model('user', user),
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

module.exports = { 
    ...models, 
    ...userDiscriminators
}
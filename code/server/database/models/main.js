const mongoose = require('mongoose')

const schema = require('./schematics/index.js')

const models = {
    jummahs: mongoose.model('jummah', schema.jummah),
    institutions: mongoose.model('institution', schema.institution),
    timings: mongoose.model('timing', schema.timing),
    locations: mongoose.model('location', schema.location),
    users: mongoose.model('user', schema.user),
    announcements: mongoose.model('announcement', schema.announcement),
    settings: mongoose.model('setting', schema.setting),
    notifications: mongoose.model('notification', schema.notification),
    shortenedURLs: mongoose.model('shortenedURL', schema.shortenedURL),
    verificationCodes: mongoose.model('verificationCode', schema.verificationCode)
}

const userTypes = {
    khateebs: models.users.discriminator('khateeb', schema.discriminators.khateeb),
    root: models.users.discriminator('root', schema.discriminators.root),
    institutionAdmins: models.users.discriminator('institutionAdmin', schema.discriminators.institutionAdmin),
    sysAdmins: models.users.discriminator('sysAdmin', schema.discriminators.sysAdmin),
    rootInstitutionAdmins: models.users.discriminator('rootInstitutionAdmin', schema.discriminators.rootInstitutionAdmin)
}

const notificationTypes = {
    generalNotifications: models.notifications.discriminator('generalNotification', schema.discriminators.generalNotification),
    actionNotifications: models.notifications.discriminator('actionNotification', schema.discriminators.actionNotification)
}

module.exports = { 
    ...models, 
    ...userTypes, 
    ...notificationTypes 
}
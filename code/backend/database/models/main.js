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
    notifications: mongoose.model('notification', schema.notification)
}

const userTypes = {
    khateebs: models.users.discriminator('khateeb', schema.khateeb),
    root: models.users.discriminator('root', schema.root),
    institutionAdmins: models.users.discriminator('institutionAdmin', schema.institutionAdmin),
    sysAdmins: models.users.discriminator('sysAdmin', schema.sysAdmin),
    rootInstitutionAdmins: models.users.discriminator('rootInstitutionAdmin', schema.rootInstitutionAdmin)
}

const notificationTypes = {
    generalNotifications: models.notifications.discriminator('generalNotification', schema.generalNotification),
    actionNotifications: models.notifications.discriminator('actionNotification', schema.actionNotification)
}

module.exports = { 
    ...models, 
    ...userTypes, 
    ...notificationTypes 
}
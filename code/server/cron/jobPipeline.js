const jummahNotifications = require('./jobs/jummahNotifications.js')
const deleteVerificationCodes = require('./jobs/deleteVerificationCodes.js')
const scripts = require(global.$dir + '/libraries/scripts/main.js')

const start = async () => {
    if (process.env.NODE_ENV !== 'production')
        return
    await scripts.createRootInstitutionAndUser()
    await scripts.createTestInstitution()
    jummahNotifications.start()
    deleteVerificationCodes.start()
    return console.log(`All cron jobs have been scheduled`)
}

module.exports = { start }
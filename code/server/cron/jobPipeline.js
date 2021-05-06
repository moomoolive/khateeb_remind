const jummahNotifications = require('./jobs/jummahNotifications.js')
const deleteVerificationCodes = require('./jobs/deleteVerificationCodes.js')
const scripts = require($rootDir + '/libraries/scripts/index.js')

const start = async () => {
    // await scripts.createRootUser()
    // await scripts.createTestInstitution()
    if (process.env.NODE_ENV !== 'production')
        return
    jummahNotifications.start()
    deleteVerificationCodes.start()
    return console.log(`All cron jobs have been scheduled`)
}

module.exports = { start }
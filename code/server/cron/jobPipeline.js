const createRootInstitutionAndUser = require('./jobs/createRootInstitutionAndUser.js')
const jummahNotifications = require('./jobs/jummahNotifications.js')
const deleteVerificationCodes = require('./jobs/deleteVerificationCodes.js')
const createTestInstitution = require('./jobs/createTestInstitution.js')
const deleteExpiredShortURLs = require('./jobs/deleteShortURLs.js')

const start = () => {
    if (process.env.NODE_ENV !== 'production')
        return
    createTestInstitution.start()
    createRootInstitutionAndUser.start()
    createTestInstitution.start()
    jummahNotifications.start()
    deleteVerificationCodes.start()
    deleteExpiredShortURLs.start()
    console.log(`All cron jobs have been scheduled`)
}

module.exports = { start }
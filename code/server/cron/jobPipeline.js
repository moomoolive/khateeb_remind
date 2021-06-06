const jummahNotifications = require('./jobs/jummahNotifications.js')
const scripts = require($rootDir + '/libraries/scripts/index.js')

const start = async () => {
    if (process.env.NODE_ENV !== 'production')
        return
    await scripts.createRootUser()
    await scripts.createTestInstitution()
    jummahNotifications.start()
    return console.log(`All cron jobs have been scheduled`)
}

module.exports = { start }
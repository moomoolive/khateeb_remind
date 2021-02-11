const cron = (callback) => {
    const cronJob = require('cron').CronJob
    const time = "0 */8 * * * *" // every eight minutes
    const job = new cronJob(time, async () => {
        try {
            const expiration = new Date()
            expiration.setMinutes(expiration.getMinutes() - 15)
            const deletedQuery = {
                createdAt: { $lte: expiration }
            }
            const codes = await $db.models.verificationCodes.deleteMany(deletedQuery)
            callback()
        } catch(err) {
            console.log(`Couldn't delete verification codes`)
        }
    }).start()
}

module.exports = cron
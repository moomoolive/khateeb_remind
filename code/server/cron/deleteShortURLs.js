const cron = () => {
    const cronJob = require('cron').CronJob
    const everyDayAt12AM = '0 0 0 * * *'
    const time = everyDayAt12AM
    const job = new cronJob(time, async() => {
        try {
            const expired = new Date()
            expired.setDate(expired.getDate() - 7)
            const anyURLsThatAreSevenDaysOrOlder = { createdAt: { $lte: expired } }
            const dbRes = await $db.models.shortenedURLs.deleteMany(anyURLsThatAreSevenDaysOrOlder)
            console.log(`Successfully delete expired urls. Database response ${dbRes}`)
        } catch(err) {
            console.log(`Couldn't delete expired short urls!`)
        }
    }).start()
}

module.exports = cron
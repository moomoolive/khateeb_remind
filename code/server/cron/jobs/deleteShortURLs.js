const cronWrapper = require(global.$dir + '/cron/cronWrapper.js')

const options = {
    job: async() => {
        try {
            const expired = new Date()
            expired.setDate(expired.getDate() - 7)
            const anyURLsThatAreSevenDaysOrOlder = { createdAt: { $lte: expired } }
            const dbRes = await $db.shortenedURLs.deleteMany(anyURLsThatAreSevenDaysOrOlder)
            console.log(`Successfully deleted expired urls. Database response ${dbRes}`)
        } catch(err) {
            console.log(`Couldn't delete expired short urls!`)
        }
    },
    time: '0 0 0 * * *', // everyday at 12AM
    syncWithTimezone: true
}

module.exports = cronWrapper(options)
const { cronWrapper } = require($rootDir + '/libraries/cron/main.js')

const options = {
    job: async () => {
        try {
            const expiration = new Date()
            expiration.setMinutes(expiration.getMinutes() - 15)
            const deletedQuery = {
                createdAt: { $lte: expiration }
            }
            const mongooseRes = await $db.verificationCodes.deleteMany(deletedQuery)
            console.log(`Expired Verification Codes Deleted. Database response: ${JSON.stringify(mongooseRes)}`)
        } catch(err) {
            console.log(`Couldn't delete verification codes`)
        }
    },
    time: "0 */8 * * * *" // every eight minutes
}

module.exports = cronWrapper(options)
const cron = (callback) => {
    const CronJob = require('cron').CronJob
    const time = new Date()
    time.setSeconds(time.getSeconds() + 10)
    const job = new CronJob(time, async () => {
        callback()
        try {
            const root = await $db.models.users.findOne({ institutionID: "__ROOT__" }).exec()
            if (!!root) {
                console.log(`Root User Already Exists`)
                return
            }
            const defaultRootUser = {
                institutionID: '__ROOT__',
                username: 'rootUser',
                password: process.env.DEFAULT_ROOT_PASS || 'password123',
                confirmed: true,
                firstName: 'rootfirst',
                lastName: 'rootlast',
                phoneNumber: 999_999_9999
            }
            const saved = await new $db.models.root(defaultRootUser).save()
            console.log(`Successfully created root user (id: ${saved._id.toString()}) with username ${saved.username}`)
        } catch(err) {
            console.log(err)
            console.log(`Root User Couldn't be created!`)
        }
    }).start()
}


module.exports = cron
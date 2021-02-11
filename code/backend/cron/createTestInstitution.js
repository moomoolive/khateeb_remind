const cron = (callback) => {
    const cronJob = require('cron').CronJob
    const time = new Date()
    time.setSeconds(time.getSeconds() + 3)
    const job = new cronJob(time, async () => {
        try {
            const testInstitution = await $db.models.institutions.findOne({ name: "__TEST__" }).exec()
            if (!!testInstitution)
                return console.log('Test institution Already Exists')
            const testTemplate = {
                name: "__TEST__",
                abbreviatedName: "__TEST__",
                timezone: "America/Edmonton",
                country: "Canada",
                state: "Alberta"
            }
            const saved = await new $db.models.institutions(testTemplate).save()
            const adminTemplate = {
                institutionID: saved._id.toString(),
                username: "testRoot",
                password: "password123",
                handle: "testMaster",
                firstName: "Mostafa",
                lastName: "Elbannan",
                phoneNumber: 100_000_0000
            }
            await new $db.models.rootInstitutionAdmins(adminTemplate).save()
            callback()
        } catch(err) {
            console.log(err)
            console.log(`Couldn't create test school`)
        }
    }).start()
}

module.exports = cron
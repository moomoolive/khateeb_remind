const cron = (callback) => {
    const crobJob = require('cron').CronJob
    const date = new Date()
    date.setSeconds(date.getSeconds() + 1)
    const job = new crobJob(date, async () => {
        const randomUser = {
            _id: "random",
            institutionID: 'random',
            username: 'randomMsg',
            handle: 'rando',
            firstName: 'Immad',
            lastName: 'Zaid',
            phoneNumber: 100_000_0000,
            title: 'none'
        }
        //const note = new _.notifications.welcome(randomUser)
        const note = new _.notifications.jummahDropout(randomUser)
        await note.setRecipentsToAdmins("602177dc94349e1ff89b2d7a")
        const msgs = await note.create()
        console.log(msgs)
        callback()
    })//.start()
}

module.exports = cron
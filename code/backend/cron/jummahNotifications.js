const cron = (callback) => {
    const crobJob = require('cron').CronJob
    const time = '00 00 6 * * 3-4' // every tuesday and wednesday 6AM
    const job = new crobJob(time, async () => {
        try {
            const institutions = await $db.models.institutions.find({ confirmed: true }).exec()
            const upcomingFriday = _.schedule.findUpcomingFriday()
            const query = { weekOf: upcomingFriday.date(), year: upcomingFriday.year(), month: upcomingFriday.month() }
            for (let i = 0; i < institutions.length; i++) {
                const institution = institutions[i]
                const jummahsThisWeek = await $db.models.jummahs.find({ institutionID: institution._id.toString(), ...query }).exec()
                for (let x = 0; x < jummahsThisWeek.length; x++) {
                    const jummah = jummahsThisWeek[x]
                    if (jummah.confirmed || jummah.khateebPreference[0].khateebID === 'TBD')
                        continue
                    jummah.khateebPreference[0].notified = true // test
                    const settings = await $db.models.settings.findOne({ institutionID: institution._id.toString() }).exec()
                    if (!jummah.khateebPreference[0].notified)
                        _.notifications.createJummahMessage(jummah)
                    else {
                        if (jummah.khateebPreference[1].khateebID !== 'TBD')
                            _.notifications.createJummahMessage(jummah, preference=2)
                        if (jummah.khateebPreference[2].khateebID !== 'TBD')
                            _.notifications.createJummahMessage(jummah, preference=3)
                    }
                }
            }
            callback()
        } catch(err) {
            console.log(err)
            console.log(`Couldn't set notifications!`)
        }
    }).start()
}

module.exports = cron
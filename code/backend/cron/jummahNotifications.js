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
                    const meta = await jummah.gatherMeta()
                    for (let y = 0; y < jummah.khateebPreference.length; y++) {
                        const preference = jummah.khateebPreference[y]
                        if (preference.notified || preference.khateebID === 'TBD')
                            continue
                        const khateeb = await $db.models.khateebs.findOne({ _id: preference.khateebID.toString() }).exec()
                        const note = new _.notifications.jummahReminder(khateeb, jummah, meta, y + 1)
                        const msgs = await note.create()
                        if (y === 0)
                            break 
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
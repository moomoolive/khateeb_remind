const job = async () => {
    try {
        const institutionQuery = test ? { name: "__TEST__" } : { confirmed: true }
        const institutions = await $db.models.institutions.find(institutionQuery).exec()
        const upcomingFriday = _.schedule.findUpcomingFriday()
        const query = { weekOf: upcomingFriday.date(), year: upcomingFriday.year(), month: upcomingFriday.month() }
        for (let i = 0; i < institutions.length; i++) {
            const institution = institutions[i]
            let settings = await $db.models.settings.findOne({ institutionID: institution._id.toString() }).exec()
            settings = settings.decrypt()
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
                    const msgs = await note.create(true, false, { text: settings })
                    console.log(msgs)
                    preference.notified = true
                    await $db.models.jummahs.updateOne({ _id: jummah._id.toString() }, jummah)
                    if (y === 0)
                        break 
                }
            }
        }
        console.log(`Set jummah notifications!`)
    } catch(err) {
        console.log(err)
        console.log(`Couldn't set notifications!`)
    }
}

const cronWrapper = require('./cronWrapper.js')

// every wednesday and thursday 6AM
const cron = (time='00 00 6 * * 3-4', syncWithTimezone=true) => {
    const options = {
        time, 
        syncWithTimezone,
        job
    }
    return cronWrapper(options)
}

module.exports = cron
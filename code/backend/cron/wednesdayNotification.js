const createJummahMessage = async (jummah, preference=1) => {
    try {
        const targetPreference = jummah.khateebPreference[preference - 1]
        const khateeb = await $db.models.khateebs.findOne({ _id: targetPreference.khateebID })
        const jummahTiming = await $db.models.timings.findOne({ _id: jummah.timingID }).exec()
        const jummahLocation = await $db.models.locations.findOne({ _id: jummah.locationID }).exec()
        const hour = jummahTiming.hour > 12 ? jummahTiming.hour - 12 : jummahTiming.hour
        const min = jummahTiming.minute
        const amOrPm = jummahTiming.hour > 11 ? 'PM' : 'AM'
        const msgTiming = `${hour}:${min} ${amOrPm}`
        const msgPreference1 = `You're scheduled to give the ${msgTiming} khutbah at ${jummahLocation.name} (${jummahLocation.address}) this week. Click here to confirm your attendance, JAK!`
        const msgPreferenceOver1 = `Are you able to give the ${msgTiming} khutbah at ${jummahLocation.name} (${jummahLocation.address}) this week? Click here to confirm your attendance, JAK!`
        const msg = {
            userID: khateeb._id.toString(),
            institutionID: jummah.institutionID,
            tag: 'jummah',
            msg: preference > 1 ? msgPreferenceOver1 : msgPreference1 ,
            actionPerformed: false,
            actionLink: `/jummah/confirm/jummah=${jummah._id.toString()}/note=__ID__`,
            buttonText: 'Confirm',
            meta: {
                jummahID: jummah._id.toString()
            }
        }
        const saved = await $db.models.actionNotifications(msg).save()
        targetPreference.notified = true
        const savedJummah = await $db.models.jummahs.updateOne({ _id: jummah._id.toString() }, { khateebPreference: jummah.khateebPreference })
    } catch(err) {
        console.log(err)
        return err
    }
}

const cron = (callback) => {
    const crobJob = require('cron').CronJob
    const time = new Date()
    time.setSeconds(time.getSeconds() + 1)
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
                    const settings = await $db.models.settings.findOne({ institutionID: institution._id.toString() }).exec()
                    if (!jummah.khateebPreference[0].notified)
                        createJummahMessage(jummah)
                    else {
                        if (jummah.khateebPreference[1].khateebID !== 'TBD')
                            createJummahMessage(jummah, preference=2)
                        if (jummah.khateebPreference[2].khateebID !== 'TBD')
                            createJummahMessage(jummah, preference=3)
                    }
                }
            }
            callback()
        } catch(err) {
            console.log(err)
            console.log(`Couldn't set notifications!`)
        }
    })//.start()
}

module.exports = cron
const express = require('express')
const cronJob = require('cron').CronJob

const router = express.Router()

router.post('/hub', express.urlencoded({extended: true}),(req, res) => {
    console.log(req.body)
})

const time = $utils.general.cronTime('every 10', 'all', 'all', 'all', 'all', 'mon')
const intialTextReminder = new cronJob(time, async () => {
    try {
        const key = $utils.schedule.currentScheduleKey()
        const schedule = await $utils.schedule.fetchSchedule(key)
        const upcomingFriday = $utils.general.findUpcomingFriday()
        // ----------------------------------------------
        upcomingFriday.setHours(0, 0, 0, 0)
        const textHub = {
            notifed: false,
            data: []
        }
        schedule.data.forEach(location => {
            const template = {
                info: location.info,
                prayers: location.monthlySchedule[upcomingFriday.toUTCString()]
            }
            textHub.data.push(template)
        })
        // --------------------------------------------------
        const khateebs = await $db.models.khateebs.find({}).exec()
        textHub.data = textHub.data.map(location => {
            location.prayers.khateebs = location.prayers.khateebs.map((khateeb, prayerTiming) => {
                const template = {
                    data: null,
                    hasResponded: {
                        state: null,
                        confirmed: false
                    }
                }
                const khateebExists = khateebs.find(person => person._id == khateeb._id)
                if (khateebExists) {
                    template.data = $utils.general.deepCopy(khateebExists)
                    template.hasResponded.state = false
                    // send text remind to khateeb
                    const text = $utils.general.stringsToSentence(
                        `text sent to ${template.data.firstName}\n`,
                        `phone number is ${template.data.phoneNumber}\n`, // how will you give precise timings ??
                        `Asalam aliakoum ${template.data.firstName},`, // should there be titles like shiekh, imam and so on?
                        `you're scheduled to give the`,
                        `${$utils.general.dateStringToAMPM(location.prayers.timings[prayerTiming])}`,
                        `khutbah this jummah at the ${location.info.name}`,
                        `insha'Allah!\n`,
                        `Address: ${location.info.address}\n`,
                        `Please Reply 'Yes' if you will make it or 'No' if you cannot! `
                    )
                    console.log(text)
                    // ------------------------------------------------------------
                } else {
                    template.data = khateeb
                }
                return template
            })
            return location
        })
        // ------------------------------------------------------
        // save to db as textHub
        // ------------------------------------------------------
        textHub.notifed = true
        console.log(textHub)
        // watch for responses after sent and update accordingly
    } catch(err) {
        // whatever error response you want
        console.log(err)
    }
})
//intialTextReminder.start()

module.exports = router
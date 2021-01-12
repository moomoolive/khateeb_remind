const express = require('express')
const cronJob = require('cron').CronJob

const router = express.Router()

router.post('/hub', express.urlencoded({extended: true}),(req, res) => {
    console.log(req.body)
})

const time = $utils.general.cronTime('every 10', 'all', 'all', 'all', 'all', 'tue')
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
        const timezone = await $db.models.timezone.findOne({}).select(['options'])
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
                if (!khateebExists) {
                    template.data = khateeb
                    return template
                }
                template.data = $utils.general.deepCopy(khateebExists)
                template.hasResponded.state = false
                let name = template.data.firstName
                if (template.data.title !== 'none')
                    name = `${template.data.title} ${name}`
                const phone = template.data.phoneNumber
                const jummahTiming = $utils.general.getLocalTime(location.prayers.timings[prayerTiming], timezone.options.name)
                // send text remind to khateeb
                const text = $utils.general.stringsToSentence(
                    `Asalam aliakoum ${name},`,
                    `you're scheduled to give the`,
                    `${jummahTiming}`,
                    `khutbah this jummah at the ${location.info.name} (${location.info.address})`,
                    `insha'Allah!`,
                    `Reply 'Yes' if you can make it or 'No' if you cannot! `
                )
                console.log(text)
                // $utils.text.send(phone, text)
                // ------------------------------------------------------------
                return template
            })
            return location
        })
        // ------------------------------------------------------
        textHub.notifed = true
        //$db.funcs.save('textHub', textHub)
    } catch(err) {
        // whatever error response you want
        console.log(err)
    }
}).start()

module.exports = router
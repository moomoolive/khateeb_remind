const cronJob = require('cron').CronJob

const templates = {
    textHub: {
        notified: false,
        timezone: null,
        finished: false,
        weekOf: null,
        data: []
    },
    location: {
        info: null,
        prayers: {}
    },
    prayerSlot: {
        data: null,
        confirm: {
            state: null,
            responded: null
        }
    }
}

const funcs = {
    dbIOError(dataName, err) {
        console.log(`Couldn't retrieve ${dataName}`)
        console.log(`Error ref: ${err}`)
    },
    async getCurrentSchedule() {
        try {
            const key = $utils.schedule.currentScheduleKey()
            const schedule = await $utils.schedule.fetchSchedule(key)
            return schedule
        } catch(err) {
            this.dbIOError('current schedule', err)
        }
    },
    createdInitialTextHub(schedule, timezone, upcomingFriday) {
        const hub = $utils.general.deepCopy(templates.textHub)
        hub.timezone = timezone.options.name
        hub.weekOf = $utils.general.deepCopy(upcomingFriday)
        schedule.data.forEach(location => {
            const template = $utils.general.deepCopy(templates.location)
            template.info = $utils.general.deepCopy(location.info)
            template.prayers = $utils.general.deepCopy(location.monthlySchedule[upcomingFriday.toUTCString()])
            hub.data.push(template)
        })
        return hub
    },
    async fetchTimezoneInfo() {
        try {
            const TZ = await $db.models.timezone.findOne({}).select(['options']).exec()
            return TZ 
        } catch(err) {
            this.dbIOError('timezone', err)
        }
    },
    async fetchKhateebs() {
        try {
            const khateebs = await $db.models.khateebs.find({}).exec()
            return khateebs
        } catch(err) {
            this.dbIOError('khateebs', err)
        }
    },
    async sendTextToKhateeb(khateeb, timezone, prayerTime, locationInfo) {
        const name = this.khateebName(khateeb)
        const phone = khateeb.phoneNumber
        try {
            const jummahTiming = $utils.general.getLocalTime(prayerTime, timezone)
            const text = `Asalam aliakoum ${name}, you're scheduled to give the\
            ${jummahTiming} khutbah this jummah at the ${locationInfo.name}\
            (${locationInfo.address}) insha'Allah!\
            Reply 'Yes' if you can make it or 'No' if you cannot.`.replace(/  +/g, ' ')
            console.log(text)
            $utils.text.send(phone, text)
        } catch(err) {
            console.log(`There was a problem send a text to ${name}`)
            console.log(`Please check if their number (${number}) exists`)
            console.log(`Or alternatively see if your institution api key is valid`)
            console.log(`Error ref: ${err}`)
        }
    },
    khateebName(khateeb) {
        if (khateeb.title.toLowerCase() !== 'none')
            return `${khateeb.title} ${khateeb.firstName}`
        else return khateeb.firstName
    },
    async textFunctionalityisOff() {
        try {
            const textFunctionality = await $db.funcs.getSetting('textFunctionality')
            if (!textFunctionality.options.active || textFunctionality.options.active === true)
                return false
            else return true
        } catch(err) {
            this.dbIOError('text functionality', err)
        }
    }
}

const cronTime = $utils.general.cronTime(
    '0',
    '0',
    '10',
    'all',
    'all',
    'wed'
)

const onTick = async () => {
    try {
        const notAllowedToText = await funcs.textFunctionalityisOff()
        if (notAllowedToText)
            return
        const schedule = await funcs.getCurrentSchedule()
        const upcomingFriday = $utils.general.findUpcomingFriday()
        upcomingFriday.setHours(0, 0, 0, 0)
        const timezone = await funcs.fetchTimezoneInfo()
        const textHub = funcs.createdInitialTextHub(schedule, timezone, upcomingFriday)
        const khateebs = await funcs.fetchKhateebs()
        textHub.data = textHub.data.map((location) => {
            location.prayers.khateebs = location.prayers.khateebs.map((khateeb, prayerTiming) => {
                const template = $utils.general.deepCopy(templates.prayerSlot)
                const khateebExists = khateebs.find(person =>  person._id == khateeb._id)
                if (!khateebExists) {
                    template.data = khateeb
                    return template
                }
                template.data = $utils.general.deepCopy(khateebExists)
                funcs.sendTextToKhateeb(
                    template.data,
                    textHub.timezone,
                    location.prayers.timings[prayerTiming],
                    location.info
                )
                template.confirm.responded = false
                return template
            })
            return location
        })
        textHub.notified = true
        $db.funcs.save('textHub', textHub)
    } catch(err) {
        console.log(`A error occurred when creating textHub`)
        console.log(`Error ref: ${err}`)
    }
}

const timeZone = 'America/Edmonton'

const settings = {
    cronTime,
    onTick,
    timeZone
}

const job = new cronJob(settings)

module.exports = job
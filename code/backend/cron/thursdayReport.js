const cronJob = require('cron').CronJob

const templates = {
    stats: {
        total: 0,
        confirmed: 0,
        confirmedNames: [],
        canceled: 0,
        canceledNames: [],
        notResponded: 0,
        notRespondedNames: [],
        unscheduled: 0,
        unscheduledNames: []
    }
}

const funcs = {
    listNames(array) {
        try {
            return ': ' + array.reduce((total, elem) => `${total}, ${elem}`)
        } catch {
            return ''
        }
    },
    createStatsMsg(stats) {
        return `Khateeb updates on ${stats.total} scheduled jummah prayers:
        ${stats.confirmed} are confirmed${this.listNames(stats.confirmedNames)}.
        ${stats.canceled} have canceled${this.listNames(stats.canceledNames)}.
        ${stats.notResponded} haven't responded${this.listNames(stats.notRespondedNames)}.
        ${stats.unscheduled} jummahs are unscheduled${this.listNames(stats.unscheduledNames)}.
        For full stats visit your Khateeb Remind dashboard!`.replace(/ +/g, ' ')
    },
    updateStats(stats, fieldName, valueToPush) {
        stats[fieldName]++
        stats[fieldName + 'Names'].push(valueToPush)
    },
    possibleStates(khateebResponseState) {
        return {
            unscheduled: khateebResponseState.responded === null,
            responded: khateebResponseState.responded === true,
            confirmed: khateebResponseState.state
        }
    }
}

const cronTime = $utils.general.cronTime(
    '0',
    '0',
    '10',
    'all',
    'all',
    'thu'
)

const onTick = async () => {
    try {
        const textHub = await $db.models.textHub.findOne({}).select(['data', 'timezone']).exec()
        const stats = $utils.general.deepCopy(templates.stats)
        textHub.data.forEach(location => {
            location.prayers.khateebs.forEach((khateeb, prayerTiming) => {
                stats.total++
                const state = funcs.possibleStates(khateeb.confirm)
                const name = `${khateeb.data.firstName} ${khateeb.data.lastName}`
                if (state.unscheduled) {
                    const prayerTime = $utils.general.getLocalTime(location.prayers.timings[prayerTiming], textHub.timezone)
                    funcs.updateStats(stats, 'unscheduled', `${location.info.name} (${prayerTime})`)
                }
                else if (!state.responded)
                    funcs.updateStats(stats, 'notResponded', name)
                else if (!state.confirmed && state.responded)
                    funcs.updateStats(stats, 'canceled', name)
                else if (state.confirmed && state.responded)
                    funcs.updateStats(stats, 'confirmed', name)
            })
        })
        const msg = funcs.createStatsMsg(stats)
        const admin = await $db.funcs.getSetting('adminProfile')
        const phoneNumber = admin.options.phoneNumber
        $utils.text.send(phoneNumber, msg)
    } catch(err) {
        console.log(err)
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
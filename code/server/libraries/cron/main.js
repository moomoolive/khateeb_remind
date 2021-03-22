const defaultOnTick = () => { console.log(`cron is active (default job)`) }
const defaultTime = (secondsAfterNow) => {
    const date = new Date()
    date.setSeconds(date.getSeconds() + secondsAfterNow)
    return date
}

const cronWrapper = (options={}) => {
    const cronOptions = {
        cronTime: options.time || defaultTime(3),
        onTick: options.job || defaultOnTick,
        syncWithTimezone: options.syncWithTimezone || false,
        timeZone: options.timeZone || null
    }
    if (cronOptions.syncWithTimezone && !cronOptions.timeZone) {
        if (cronOptions.cronTime instanceof Date || typeof cronOptions.cronTime !== 'string')
            throw TypeError(`You must provide a valid cron.js timing string to use 'on schedule' option`)
        cronOptions.timeZone = global.APP_CONFIG.cron.timezone
    }
    const cronJob = require('cron').CronJob
    return new cronJob(cronOptions)
}

module.exports = { 
    cronWrapper
}
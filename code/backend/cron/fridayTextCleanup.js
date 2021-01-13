const cronJob = require('cron').CronJob

const cronTime = $utils.general.cronTime(
    '0',
    '0',
    '22',
    'all',
    'all',
    'fri'
)

const onTick = async () => {
    const textHub = await $db.models.textHub.findOne({}).exec()
    textHub.finished = true
    $db.funcs.save('textHub', textHub)
}

const timeZone = 'America/Edmonton'

const settings = {
    cronTime,
    onTick,
    timeZone
} 

const job = new cronJob(settings)

module.exports = job
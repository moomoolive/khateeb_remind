const cronWrapper = require($DIR + '/cron/cronWrapper.js')

const time = new Date()
time.setSeconds(time.getSeconds() + 5)

const options = {
    job: async () => {
        try {
            const jummahs = await $db.models.jummahs.find({}).exec()
            console.log(jummahs)
            for (let i = 0; i < jummahs.length; i++) {
                const jummah = jummahs[i]
                console.log(jummah)
                console.log(jummah.weekOf, jummah.month, jummah.year)
                if (!jummah.weekOf || !jummah.month || !jummah.year)
                    continue 
                const date = new Date()
                date.setFullYear(jummah.year)
                date.setMonth(jummah.month)
                date.setDate(jummah.weekOf)
                date.setUTCHours(12, 0, 0, 0)
                const updated = await $db.models.jummahs.findOneAndUpdate({ _id: jummah._id.toString() }, { date: new Date(date) })
                console.log(updated)
            }
            console.log('Successfully updated jummahs to new date system')
        } catch(err) {
            console.log(err)
            console.log(`Couldn't update jummahs to new date system`)
        }
    },
    time
}

module.exports = cronWrapper(options)
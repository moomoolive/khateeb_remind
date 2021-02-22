const cronWrapper = require($DIR + '/cron/cronWrapper.js')

const options = {
    job: async () => {
        try {
            const jummahs = await $db.models.jummahs.find({}).exec()
            for (let i = 0; i < jummahs.length; i++) {
                const jummah = jummahs[i]
                if (!jummah.weekOf || !jummah.month || !jummah.year)
                    continue 
                const date = new Date()
                date.setFullYear(jummah.year)
                date.setMonth(jummah.month)
                date.setDate(jummah.weekOf)
                date.setUTCHours(12, 0, 0, 0)
                const updated = await $db.models.jummahs.findOneAndupdate({ _id: jummah._id.toString() }, { date: new Date(date) })
                console.log(updated)
            }
            console.log('Successfully updated jummahs to new date system')
        } catch(err) {
            console.log(`Couldn't update jummahs to new date system`)
        }
    }
}

module.exports = cronWrapper(options)
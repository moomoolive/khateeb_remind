const helpers = require('./helpers.js')

const createAssociatedJummahs =  async (locationID, timingID, institutionID, startingDate=helpers.createDayJs()) => {
    const upcomingFriday = helpers.findUpcomingFriday(startingDate)
    const remainingFridaysDayJs = helpers.findAllFridays(upcomingFriday, false)
    const prayerSlot = {
        notified: false,
        confirmed: false,
        responded: false,
        khateebID: 'TBD'
    }
    const maxKhateebPreference = 3
    const createdJummahs = []
    for (let i = 0; i < remainingFridaysDayJs.length; i++) {
        const jummahDateIdentifier = remainingFridaysDayJs[i]
        /* 
            I didn't pick the time to 12PM UTC for any particular reason, I just picked
            a random hour on the jummah date. These will be used to query jummahs
            by date, month, or year and therefore the particular hour doesn't matter.
            jummah timing is identified by the timingID foriegn key.

            The reason for designing it this way, is to ease the process of changing timings.
            Designing the system this way allows the jummah to NOT be modified everytime
            a timing is changed.
        */
        const date = new Date(Date.UTC(
                jummahDateIdentifier.year(),
                jummahDateIdentifier.month(),
                jummahDateIdentifier.date(),
                12,
                0,
                0,
                0
            )
        )
        const jummah = {
            institutionID,
            locationID,
            timingID,
            date,
            confirmed: false,
            khateebPreference: [],
        }
        for (let x = 0; x < maxKhateebPreference; x++) {
            jummah.khateebPreference.push(prayerSlot)
        }
        try {
            const savedJummah = await new $db.jummahs(jummah).save()
            createdJummahs.push(savedJummah)
        } catch(err) {
            console.log(err)
            console.log(`Couldn't commit jummah to database, returned jummah without ids`)
            createdJummahs.push(jummah)
        }
    }
    return createdJummahs
}

const createJummahsForTiming = async (locationID, timingID, institutionID) => {
    try {
        await createAssociatedJummahs(locationID, timingID, institutionID)
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth.setDate(1)
        nextMonth.setUTCHours(12, 0, 0, 0)
        const jummahsNextMonth = await $db.jummahs.findOne({ date: { $gte: nextMonth } }).exec()
        if (!jummahsNextMonth)
            return
        const startingDate = helpers.createDayJs({ 
            date: nextMonth.getDate(), 
            year: nextMonth.getFullYear(), 
            month: nextMonth.getMonth() 
        })
        await createAssociatedJummahs(locationID, timingID, institutionID, startingDate)
    } catch(err) {
        console.log(err)
        console.log(`Couldn't create jummahs for timing ${timingID}`)
    }
}

const build = async (month, year, institutionID) => {
    try {
        const prayerInfo = await helpers.getActiveLocationsAndTimings(institutionID)
        const linkedTimesAndLocations = helpers.linkTimesAndLocations(prayerInfo)
        let jummahEntries = []
        const isCurrentMonth = month === new Date().getMonth()
        const startOfMonth = { date: 1, month, year }
        const today = {}
        const startingDate = helpers.createDayJs(isCurrentMonth  ? today : startOfMonth)
        for (const [locationID, timingIDs] of Object.entries(linkedTimesAndLocations)) {
            for (let i = 0; i < timingIDs.length; i++) {
                const jummahs = await createAssociatedJummahs(locationID, timingIDs[i], institutionID, startingDate)
                jummahEntries = [...jummahEntries, ...jummahs]
            }
        }
        return jummahEntries
    } catch(err) {
        console.log(`Could not build schedule for ${month} ${year}`)
        console.log(err)
    }
}

module.exports = {
    build,
    createAssociatedJummahs,
    findUpcomingFriday: helpers.findUpcomingFriday,
    createJummahsForTiming
}
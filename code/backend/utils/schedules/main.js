const helpers = require('./helpers.js')

const build = async (month, year, institutionID) => {
    try {
        const fridays = helpers.fridaysOfMonth(month, year)
        const prayerInfo = await helpers.getActiveLocationsAndTimings(institutionID)
        console.log(prayerInfo)
        const emptyJummah = helpers.getEmptyJummah()
        const emptyJummahArray = helpers.createEmptyJummahsEntries(
            emptyJummah, prayerInfo, fridays, month,
            year, institutionID
        )
        const jummahEntries = await helpers.createJummahsAndReturnEntries(emptyJummahArray)
        return jummahEntries
    } catch(err) {
        console.log(`Could not build schedule for ${month} ${year}`)
        console.log(err)
    }
}

const futureJummahsAssociated = async (associatedWith) => {
    const upcomingFriday = helpers.findUpcomingFriday()
    const remainingFridaysDayJs = helpers.findAllFridays(upcomingFriday, false)
    const upcomingMonthFridaysDayJs = helpers.fridaysNextMonth(false)
    return helpers.createAssociatedJummahKeys(remainingFridaysDayJs, upcomingMonthFridaysDayJs, associatedWith)
}

const createAssociatedJummahs =  async (locationID, timingID, institutionID) => {
    const upcomingFriday = helpers.findUpcomingFriday()
    const remainingFridaysDayJs = helpers.findAllFridays(upcomingFriday, false)
    const prayerSlot = {
        notified: false,
        confirmed: false,
        responded: false,
        khateebID: 'TBD'
    }
    const maxKhateebPreference = 3
    for (let i = 0; i < remainingFridaysDayJs.length; i++) {
        const jummahDateIdentifier = remainingFridaysDayJs[i]
        const jummah = {
            institutionID,
            locationID,
            timingID,
            weekOf: jummahDateIdentifier.date(),
            year: jummahDateIdentifier.year(),
            month: jummahDateIdentifier.month(),
            confirmed: false,
            khateebPreference: [],
        }
        for (let x = 0; x < maxKhateebPreference; x++) {
            jummah.khateebPreference.push(prayerSlot)
        }
        const saved = await new $db.models.jummahs(jummah).save()
    }
}

module.exports = {
    build,
    futureJummahsAssociated,
    createAssociatedJummahs
}
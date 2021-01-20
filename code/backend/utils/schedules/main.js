const helpers = require('./helpers.js')

const build = async (month, year, institutionID) => {
    try {
        const fridays = helpers.fridaysOfMonth(month, year)
        const prayerInfo = await helpers.getActiveLocationsAndTimings(institutionID)
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

module.exports = {
    build,
    futureJummahsAssociated
}
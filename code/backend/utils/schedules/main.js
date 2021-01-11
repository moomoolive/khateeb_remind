const $db = require('../../database/index.js')
const general = require('../funcs.js')
const helpers = require('./helpers.js')

const equal = require('fast-deep-equal')

module.exports = {
    currentScheduleKey() {
        const upcomingFriday = general.findUpcomingFriday()
        const month = upcomingFriday.toLocaleString('default', { month: 'long' })
        return `${month}-${upcomingFriday.getFullYear()}`
    },
    fetchSchedule(scheduleKey) {
        return new Promise((resolve, reject) => {
            $db.models.monthlySchedules.findOne({ month: scheduleKey }, (err, schedule) => {
                if (err) {
                    console.log(err)
                    reject()
                } else resolve(schedule)
            })
        })
    },
    new(scheduleKey, locationAndTimings) {
        const allFridays = helpers.findAllFridaysFromKey(scheduleKey)
        const newSchedule = {
            month: scheduleKey,
            data : []
        }
        locationAndTimings.options.forEach(location => {
            const emptyLocation = helpers.createEmptyLocation(
                helpers.toBeDecidedIndicator(),
                allFridays,
                location
            )
            newSchedule.data.push(emptyLocation)
        })
        return newSchedule
    },
    update(oldSchedule, currentLocationDetails) {
        const updatedLocations = helpers.adjustNumberOfLocations(oldSchedule, currentLocationDetails)
        currentLocationDetails.options.forEach((location, index) => {
            updatedLocations.data[index].info = location.info
            updatedLocations.data[index].monthlySchedule = helpers.checkIfTimingsAreSame(updatedLocations.data[index], location)
        })
        
        return updatedLocations
    },
    needsUpdate(locations, schedule) {
        if (!schedule)
            return null
        const locationsSavedOn = new Date(locations.savedOn).getTime()
        const scheduleSavedOn= new Date(schedule.savedOn).getTime()
        return (locationsSavedOn > scheduleSavedOn) && helpers.scheduleIsInCurrentMonthOrBeyond(locations, schedule)
    },
    checkForUpdates(updated, original) {
        const updatedSchedule = JSON.parse(JSON.stringify(updated))
        updatedSchedule.data.forEach((location, locationIndex) => {
            for(let [weekOf, weekInfo] of Object.entries(location.monthlySchedule)) {
                weekInfo.khateebs.forEach((khateeb, khateebIndex) => {
                    const originalVal = original.data[locationIndex].monthlySchedule[weekOf].khateebs[khateebIndex]
                    if(!equal(khateeb, originalVal)) {
                        khateeb.savedOn = new Date()
                    }
                })
            }
        })
        delete updatedSchedule.original
        return updatedSchedule
    },
    TBDIndicator() {
        return helpers.toBeDecidedIndicator()
    }
}
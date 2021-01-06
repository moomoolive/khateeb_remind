import $db from '../database/index.js'
import general from './funcs.js'
import equal from 'fast-deep-equal'

const subHelper = {
    monthNames: ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ],
    deepCopy(object) {
        return JSON.parse(JSON.stringify(object))
    },
    emptyLocationTemplate() {
        return $db.models.emptySchema('locationTemplate')
    },
    emptyPrayerSlots(filledWith, timingsArray) {
        const arr = []
        timingsArray.forEach(timing => {
            arr.push(filledWith)
        })
        return arr
    },
    adjustPrayerSlots(newTimings, oldPrayerSlots, toBeDecidedIndicator) {
        const updatedPrayerSlots = this.deepCopy(oldPrayerSlots)
        const diff = newTimings.length - oldPrayerSlots.length
        for (let i = 0; i < Math.abs(diff); i++) {
            diff < 0 ? updatedPrayerSlots.pop() : updatedPrayerSlots.push(toBeDecidedIndicator)
        }
        return updatedPrayerSlots
    },
    weekIsInFuture(dateString) {
        const date = new Date(dateString)
        return date > new Date() 
    }
}

const helpers = {
    dateObjectFromString(monthYearString) {
        const decoded = monthYearString.split('-')
        const month = subHelper.monthNames.indexOf(decoded[0])
        const year = decoded[1]
        return new Date(year, month, 1)
    },
    findUpcomingFriday(date=new Date()) {
        const friday = 5
        while (date.getDay() !== friday) {
            date.setDate(date.getDate() + 1)
        }
        return date
    },
    findAllFridays(dateObjectFirstFriday) {
        const fridays = []
        const thisMonth = dateObjectFirstFriday.getMonth()
        const oneWeek = 7
        while (dateObjectFirstFriday.getMonth() === thisMonth) {
            fridays.push(subHelper.deepCopy(dateObjectFirstFriday.toUTCString()))
            dateObjectFirstFriday.setDate(dateObjectFirstFriday.getDate() + oneWeek)
        }
        return fridays
    },
    toBeDecidedIndicator() {
        const prayerSlotTemplate = $db.models.emptySchema('prayerSlot')
        prayerSlotTemplate.firstName = 'TBD'
        return prayerSlotTemplate
    },
    createEmptyLocation(emptyPrayerSlotTemplate, weeksInMonth, locationDetails) {
        const x = subHelper.deepCopy(locationDetails)
        const locationTemplate = subHelper.emptyLocationTemplate()
        locationTemplate.info = x.info
        weeksInMonth.forEach(fridayDateObject => {
            locationTemplate.monthlySchedule[fridayDateObject] = {
                timings: x.timings,
                khateebs: subHelper.emptyPrayerSlots(
                    emptyPrayerSlotTemplate,
                    x.timings
                )
            }

        })
        return locationTemplate
    },
    findAllFridaysFromKey(scheduleKey) {
        const dateObjectFirstDayOfMonth = this.dateObjectFromString(scheduleKey)
        const firstFriday = this.findUpcomingFriday(dateObjectFirstDayOfMonth)
        return this.findAllFridays(firstFriday)
    },
    adjustNumberOfLocations(oldSchedule, currentLocationDetails) {
        const newLocations = subHelper.deepCopy(oldSchedule)
        const oldLocations = newLocations.data.length
        const updatedLocations = currentLocationDetails.options.length
        const diff = updatedLocations - oldLocations
        for (let i = 0; i < Math.abs(diff); i++) {
            if (diff < 0) {
                newLocations.data.pop()
                continue
            }
            const emptyLocation = this.createEmptyLocation(
                this.toBeDecidedIndicator(),
                Object.keys(oldSchedule.data[0].monthlySchedule),
                currentLocationDetails.options[oldLocations + i]
            )
            newLocations.data.push(emptyLocation) 
        }
        return newLocations
    },
    checkIfTimingsAreSame(oldSchedule, currentLocationDetails) {
        const updatedTimingsSchedule = subHelper.deepCopy(oldSchedule)
        for (const [key, value] of Object.entries(updatedTimingsSchedule.monthlySchedule)) {
            if (subHelper.weekIsInFuture(key) && value.timings !== currentLocationDetails.timings) {
                value.timings = subHelper.deepCopy(currentLocationDetails.timings)
                value.khateebs = subHelper.adjustPrayerSlots(
                    value.timings, 
                    value.khateebs,
                    this.toBeDecidedIndicator()
                )
            }
        }
        return updatedTimingsSchedule.monthlySchedule
    },
    scheduleIsInCurrentMonthOrBeyond(locations, schedule) {
        const locationsMonth = new Date(locations.savedOn).setDate(1)
        locationsMonth.setHours(0,0,0,0)
        const scheduleSavedOn = new Date(schedule.savedOn)
        return scheduleSavedOn.getTime() > locationsMonth.getTime()
    }
}

export default {
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
    }
}
const funcs = require($DIR + '/utils/funcs.js')

const helpers = {
    emptyPrayerSlots(filledWith, timingsArray) {
        const arr = []
        timingsArray.forEach(timing => {
            const fill = $utils.general.deepCopy(filledWith)
            fill.timing = timing
            arr.push(fill)
        })
        return arr
    },
    adjustPrayerSlots(newTimings, oldPrayerSlots, toBeDecidedIndicator) {
        const updatedPrayerSlots = $utils.general.deepCopy(oldPrayerSlots)
        const diff = newTimings.length - oldPrayerSlots.length
        for (let i = 0; i < Math.abs(diff); i++) {
            diff < 0 ? updatedPrayerSlots.pop() : updatedPrayerSlots.push(toBeDecidedIndicator)
        }
        return updatedPrayerSlots
    },
    weekIsInFuture(dateString) {
        const date = new Date(dateString)
        return date > new Date() 
    },
    adjustTimingDate(fridayDateObject, timings) {
        const updatedTimings = []
        const fridayDate = new Date(fridayDateObject)
        const month = fridayDate.getMonth()
        const date = fridayDate.getDate()
        timings.forEach(timing => {
            const x = new Date(timing)
            x.setMonth(month)
            x.setDate(date)
            x.setSeconds(0, 0)
            updatedTimings.push(x)
        })
        return updatedTimings
    }
}

module.exports = {
    dateObjectFromString(monthYearString) {
        const decoded = monthYearString.split('-')
        const month = funcs.monthStringToNumber(decoded[0])
        const year = decoded[1]
        return new Date(year, month, 1)
    },
    findUpcomingFriday(date=new Date()) {
        console.log(date)
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
            fridays.push($utils.general.deepCopy(dateObjectFirstFriday.toUTCString()))
            dateObjectFirstFriday.setDate(dateObjectFirstFriday.getDate() + oneWeek)
        }
        return fridays
    },
    toBeDecidedIndicator() {
        const prayerSlotTemplate = $db.models.emptySchema('prayerSlot')
        prayerSlotTemplate.data.firstName = 'TBD'
        prayerSlotTemplate.confirm.state = null
        prayerSlotTemplate.confirm.responded = null
        return prayerSlotTemplate
    },
    createEmptyLocation(emptyPrayerSlotTemplate, weeksInMonth, locationDetails) {
        const details = $utils.general.deepCopy(locationDetails)
        let monthlySchedule = {}
        weeksInMonth.forEach(fridayDateObject => {
            const updatedTimings = helpers.adjustTimingDate(fridayDateObject, details.timings)
            const data = $utils.general.deepCopy(emptyPrayerSlotTemplate)
            const emptyPrayerSlots = helpers.emptyPrayerSlots(data, updatedTimings, fridayDateObject)
            monthlySchedule[fridayDateObject] = emptyPrayerSlots
        })
        return monthlySchedule
    },
    findAllFridaysFromKey(scheduleKey) {
        const dateObjectFirstDayOfMonth = this.dateObjectFromString(scheduleKey)
        const firstFriday = this.findUpcomingFriday(dateObjectFirstDayOfMonth)
        return this.findAllFridays(firstFriday)
    },
    adjustNumberOfLocations(oldSchedule, currentLocationDetails) {
        const newLocations = $utils.general.deepCopy(oldSchedule)
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
        const updatedTimingsSchedule = $utils.general.deepCopy(oldSchedule)
        for (const [key, value] of Object.entries(updatedTimingsSchedule.monthlySchedule)) {
            if (helpers.weekIsInFuture(key) && value.timings !== currentLocationDetails.timings) {
                value.timings = $utils.general.deepCopy(currentLocationDetails.timings)
                value.khateebs = helpers.adjustPrayerSlots(
                    value.timings, 
                    value.khateebs,
                    this.toBeDecidedIndicator()
                )
            }
        }
        return updatedTimingsSchedule.monthlySchedule
    },
    scheduleIsInCurrentMonthOrBeyond(locations, schedule) {
        const locationsMonth = new Date(locations.savedOn)
        locationsMonth.setDate(1)
        locationsMonth.setHours(0,0,0,0)
        const scheduleSavedOn = new Date(schedule.savedOn)
        return scheduleSavedOn.getTime() > locationsMonth.getTime()
    },
    khateebToPrayerSlots(khateeb) {
        const template = this.toBeDecidedIndicator()
        template.data = $utils.general.deepCopy(khateeb)
        return template
    }
}
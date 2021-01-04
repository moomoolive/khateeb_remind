import general from '../funcs.js'
import $db from '../../database/index.js'

export default {
    createScheduleKey() {
        const upcomingFriday = general.findUpcomingFriday()
        const month = upcomingFriday.toLocaleString('default', { month: 'long' })
        return `${month}${upcomingFriday.getFullYear()}`
    },
    emptyLocationTemplate() {
        return $db.models.emptySchema('locationTemplate')
    },
    emptyWeeklySchedule(timings, emptySlotIndicator) {
        let emptyWeek = []
        for (let timing in timings) {
            emptyWeek.push(emptySlotIndicator)
        }
        return emptyWeek
    },
    emptyMonthlySchedule(weeksInMonth, emptyWeek) {
        let schedule = {}
        for (let week of weeksInMonth) {
            schedule[week] = emptyWeek
        }
        return schedule
    },
    emptySchedule(timings, weeksInMonth, emptySlotIndicator) {
        const emptyWeek = this.emptyWeeklySchedule(timings, emptySlotIndicator)
        return this.emptyMonthlySchedule(weeksInMonth, emptyWeek)
    },
    emptyLocation(location, weeksInMonth, emptySlotIndicator) {
        const emptyLocation = this.emptyLocationTemplate()
        const tempLocation = this.cloneObject(emptyLocation)
        tempLocation.info = location.info
        tempLocation.timings = location.timings
        tempLocation.monthlySchedule = this.emptySchedule(
            tempLocation.timings,
            weeksInMonth,
            emptySlotIndicator
        )
        return tempLocation
    },
    cloneObject(object) {
        return JSON.parse(JSON.stringify(object))
    },
    removeExcessLocations(oldLocations, newLocations) {
        const diff = oldLocations.length - newLocations.length
        if (diff > 0) {
            for (let x = 0; x < diff; x++) {
                oldLocations.pop()
            }
        }
    },
    removeExcessTimings(oldTiming, newTiming) {
        const diff = oldTiming.length - newTiming.length
        if (diff > 0) {
            for (let x = 0; x < diff; x++) {
                oldTiming.pop()
            }
        }
        return { time: oldTiming, diff }
    },
    findMismatchedTimings(oldTiming, newTiming) {
        let mismatchedTimings = []
        for (let x = 0; x < newTiming.length; x++) {
            if(!equal(oldTiming[x], newTiming[x])) {
                oldTiming[x] = newTiming[x]
                mismatchedTimings.push(x)
            }
        return mismatchedTimings
        }
    },
    updateTimings(oldTimings, newTimings) {
        const shavedTimings = this.removeExcessTimings(
            oldTimings,
            newTimings
        )
        const mismatchedTimings = this.findMismatchedTimings(
            shavedTimings.time,
            newTimings
        )
        return { mismatchedTimings, diff: shavedTimings.diff }
    },
    fillMismatchedWithTBD(mismatchedTimings, emptySlotIndicator, oldLocation, diff) {
        for (let week in oldLocation.monthlySchedule) {
            for (let x = 0; x < diff; x++) {
                oldLocation.monthlySchedule[week].pop()
            }
            let y = 0
            for (let x = 0; x < oldLocation.timings.length; x++) {
                if (x === mismatchedTimings[y] || !oldLocation.monthlySchedule[week][x]) {
                    oldLocation.monthlySchedule[week][x] = emptySlotIndicator
                    if (x === mismatchedTimings[y]) y++
                }
            }
        }
        return oldLocation.monthlySchedule
    }
}
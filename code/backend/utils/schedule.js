import equal from 'fast-deep-equal'

import $db from '../database/funcs.js'
import $dbModels from '../database/models.js'

const columnData = ['Timing', 'Khateeb'] // hardcoded for now
const emptyLocation = {
    info: { },
    timings: [],
    monthlySchedule: { }
}

export default {
    new(weeksInMonth, locationAndTiming) {
        const TBD = this.toBeDecidedIndicator()
        const tableData = locationAndTiming.options
        const newSchedule = []
        for (let location in tableData) {
            newSchedule[location] = this.emptyLocation(
                tableData[location],
                weeksInMonth,
                TBD
            )
        }
        return {
            columnData,
            rows: newSchedule
        }
    },
    update(weeksInMonth, locationAndTiming, schedule) {
        const TBD = this.toBeDecidedIndicator()
        this.removeExcessLocations(schedule.data.rows, locationAndTiming.options)
        for (let location = 0; location < locationAndTiming.options.length; location++) {
            if (schedule.data.rows[location]) {
                const updates = this.cloneObject(locationAndTiming.options[location])
                const old = this.cloneObject(schedule.data.rows[location])
                old.info = updates.info
                const scheduleUpdates = this.updateTimings(old.timings, updates.timings)
                old.timings = updates.timings
                old.monthlySchedule = this.fillMismatchedWithTBD(
                    scheduleUpdates.mismatchedTimings,
                    TBD,
                    old,
                    scheduleUpdates.diff
                )
                schedule.data.rows[location] = old
            } else {
                schedule.data.rows[location] = this.emptyLocation(
                    locationAndTiming.options,
                    weeksInMonth,
                    TBD
                )
            }
        }
        $db.save('monthlySchedules', schedule)
        return schedule
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
        console.log(oldLocation)
        console.log(diff)
        for (let week in oldLocation.monthlySchedule) {
            for (let x = 0; x < diff; x++) {
                oldLocation.monthlySchedule[week].pop()
            }
            let y = 0
            for (let x = 0; x < oldLocation.timings.length; x++) {
                console.log('hi')
                if (x === mismatchedTimings[y] || !oldLocation.monthlySchedule[week][x]) {
                    oldLocation.monthlySchedule[week][x] = emptySlotIndicator
                    if (x === mismatchedTimings[y]) y++
                }
            }
        }
        return oldLocation.monthlySchedule
    },
    toBeDecidedIndicator() {
        const fullKhateebSchema = $dbModels.schemaParams('khateebs', true)
        let returnSchema = {}
        for (let field of fullKhateebSchema) {
            if (field === '_id' || field === 'firstName' || field === 'lastName') {
                returnSchema[field] = null
            }
        }
        return returnSchema
    }
}
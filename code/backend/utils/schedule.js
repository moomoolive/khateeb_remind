import $db from '../database/funcs.js'
import equal from 'fast-deep-equal'
import dbModels from '../database/models.js'

const columnData = ['Timing', 'Khateeb'] // hardcoded for now
const emptyLocation = {
    info: { },
    timing: [],
    monthlySchedule: { }
}

export default {
    createNewSchedule(weeksInMonth, locationAndTiming) {
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
        tempLocation.timing = location.timings
        tempLocation.monthlySchedule = this.emptySchedule(
            tempLocation.timing,
            weeksInMonth,
            emptySlotIndicator
        )
        return tempLocation
    },
    cloneObject(object) {
        return JSON.parse(JSON.stringify(object))
    },
    updateExistingSchedule(weeksInMonth, locationAndTiming, schedule) {
        const TBD = this.toBeDecidedIndicator()
        this.removeExcessLocations(schedule.data.rows, locationAndTiming.options)
        for (let location = 0; location < locationAndTiming.options.length; location++) {
            if (schedule.data.rows[location]) {
                const updates = this.cloneObject(locationAndTiming.options[location])
                const old = this.cloneObject(schedule.data.rows[location])
                old.info = updates.info
                /*const updatedTimingLength = locationAndTiming.options[location].timings.length
                const oldTimingLength = schedule.data.rows[location].timing.length
                const diff = oldTimingLength - updatedTimingLength < 0 ? 0 : oldTimingLength - updatedTimingLength
                for (let x = 0; x < diff; x++) {
                    schedule.data.rows[location].timing.pop()
                } */
                const mismatchedTimings = this.updateTimings(
                    old.timings,
                    updates.timing
                )
                /* let mismatchedTimings = []
                for (let x = 0; x < locationAndTiming.options[location].timings.length; x++) {
                    const y = locationAndTiming.options[location].timings[x]
                    if (!equal(schedule.data.rows[location].timing[x], y)) {
                        schedule.data.rows[location].timing[x] = compareVal
                        mismatchedTimings.push(x)
                    }
                } */
                old.monthlySchedule = this.fillMismatchedWithTBD(
                    mismatchedTimings,
                    TBD,
                    old
                )
                old.timings = updates.timing
                /* for (let week in schedule.data.rows[location].monthlySchedule) {
                    for (let x = 0; x < diff; x++) {
                        schedule.data.rows[location].monthlySchedule[week].pop()
                    }
                    let y = 0
                    for (let x = 0; x < schedule.data.rows[location].monthlySchedule[week].length; x++) {
                        if (x === mismatchedTimings[y]) {
                            schedule.data.rows[location].monthlySchedule[week][x] = TBD
                            y++
                        }
                    }
                } */
                schedule.data.rows[location] = old
            } else {
                schedule.data.rows[location] = this.emptyLocation(
                    locationAndTiming.options,
                    weeksInMonth,
                    TBD
                )
            }
        }
        //$db.save('monthlySchedules', schedule)
        return schedule
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
                oldTiming.timings.pop()
            }
        }
        return oldTiming
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
        return this.findMismatchedTimings(
            shavedTimings,
            newTimings
        )
    },
    fillMismatchedWithTBD(mismatchedTimings, emptySlotIndicator, oldLocation) {
        const diff = oldTiming.length - newTiming.length // not sure if this is how it'll be passed in yet
        for (let week in oldLocation.monthlySchedule) {
            for (let x = 0; x < diff; x++) {
                oldLocation.monthlySchedule[week].pop()
            }
            let y = 0
            for (let x = 0; oldLocation.monthlySchedule[week].length; x++) {
                if (x === mismatchedTimings[y]) {
                    oldLocation.monthlySchedule[week] = emptySlotIndicator
                    y++
                }
            }
        }
        return oldLocation.monthlySchedule
    },
    toBeDecidedIndicator() {
        const fullKhateebSchema = dbModels.schemaParams('khateebs', true)
        let returnSchema = {}
        for (let field of fullKhateebSchema) {
            if (field === '_id' || field === 'firstName' || field === 'lastName') {
                returnSchema[field] = null
            }
        }
        return returnSchema
    }
}
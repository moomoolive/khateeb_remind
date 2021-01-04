import helpers from './helpers.js'
import $db from '../../database/index.js'

const main = {
    fetchCurrentSchedule() {
        const scheduleKey = helpers.createScheduleKey()
        return new Promise((resolve, reject) => {
            $db.models.monthlySchedules.findOne({ month: scheduleKey }, (err, schedule) => {
                if (err) {
                    console.log(err)
                    reject()
                } else resolve(schedule)
            })
        })
    },
    new(weeksInMonth, locationAndTiming) {
        const TBD = this.toBeDecidedIndicator()
        const tableData = locationAndTiming.options
        const newSchedule = []
        for (let location in tableData) {
            newSchedule[location] = helpers.emptyLocation(
                tableData[location],
                weeksInMonth,
                TBD
            )
        }
        return {
            rows: newSchedule
        }
    },
    update(weeksInMonth, locationAndTiming, schedule) {
        const TBD = this.toBeDecidedIndicator()
        helpers.removeExcessLocations(schedule.data.rows, locationAndTiming.options)
        for (let location = 0; location < locationAndTiming.options.length; location++) {
            if (schedule.data.rows[location]) {
                const updates = helpers.cloneObject(locationAndTiming.options[location])
                const old = helpers.cloneObject(schedule.data.rows[location])
                old.info = updates.info
                const scheduleUpdates = helpers.updateTimings(old.timings, updates.timings)
                old.timings = updates.timings
                old.monthlySchedule = helpers.fillMismatchedWithTBD(
                    scheduleUpdates.mismatchedTimings,
                    TBD,
                    old,
                    scheduleUpdates.diff
                )
                schedule.data.rows[location] = old
            } else {
                schedule.data.rows[location] = helpers.emptyLocation(
                    locationAndTiming.options,
                    weeksInMonth,
                    TBD
                )
            }
        }
        $db.funcs.save('monthlySchedules', schedule)
        return schedule
    },
    toBeDecidedIndicator() {
        const prayerSlotTemplate = $db.models.emptySchema('prayerSlot')
        prayerSlotTemplate.firstName = 'TBD'
        return prayerSlotTemplate
    },
    updatePrayerSlotDates(currentSchedule, originalSchedule) {
        for (let location in currentSchedule.data.rows) {
            for (let week in currentSchedule.data.rows[location].monthlySchedule) {
                for (let prayerSlot in currentSchedule.data.rows[location].monthlySchedule[week]) {
                    if (
                        currentSchedule.data.rows[location].monthlySchedule[week][prayerSlot]._id !==
                        originalSchedule.data.rows[location].monthlySchedule[week][prayerSlot]._id
                    ) {
                        currentSchedule.data.rows[location].monthlySchedule[week][prayerSlot].savedOn = new Date().toUTCString()
                    }

                }
            }
        }
        return currentSchedule
    }
}

export default main
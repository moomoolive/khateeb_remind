export default {
    createNewScheduleFromSettings(weeksInMonth, locationAndTiming) {
        const tableData = locationAndTiming.options
        const newSchedule = []
        const toBeDecidedIndicator = 'TBD'
        for (let location in tableData) {
            newSchedule[location] = {
                info: { },
                timing: [],
                monthlySchedule: { }
            }
            newSchedule[location].info = tableData[location].info
            let timingsArray = []
            let emptyKhateebsArray = []
            for (let timing in tableData[location].timings) {
                timingsArray.push(tableData[location].timings[timing])
                emptyKhateebsArray.push(toBeDecidedIndicator)
            }
            newSchedule[location].timing = timingsArray
            for (let week of weeksInMonth) {
                newSchedule[location].monthlySchedule[week] = emptyKhateebsArray
            }
        }
        return newSchedule
    },
    updateExistingScheduleWithNewSettings(schedule, locationAndTiming) {
        const updatedNumberOfLocations = locationAndTiming.options.length
        const oldNumberOfLocations = schedule.data.length
        const difference = oldNumberOfLocations - updatedNumberOfLocations < 0 ? 0 : oldNumberOfLocations - updatedNumberOfLocations
        for (let x = 0; x < difference; x++) {
            schedule.data.pop()
        }
        for (let location = 0; location < locationAndTiming.options.length; location++) {
            if (schedule.data[location]) {
                schedule.data[location].info = JSON.parse(JSON.stringify(locationAndTiming.options[location].info))
                const updatedTimingLength = locationAndTiming.options[location].timings.length
                const oldTimingLength = schedule.data[location].timing.length
                const diff = oldTimingLength - updatedTimingLength < 0 ? 0 : oldTimingLength - updatedTimingLength
                for (let x = 0; x < diff; x++) {
                    schedule.data[location].timing.pop()
                }
                let mismatchedTimings = []
                for (let x = 0; x < locationAndTiming.options[location].timings.length; x++) {
                    const y = locationAndTiming.options[location].timings[x]
                    const compareVal = `${y.hour}:${y.minutes}${y.AMorPM}`
                    if (schedule.data[location].timing[x] !== compareVal) {
                        schedule.data[location].timing[x] = compareVal
                        mismatchedTimings.push(x)
                    }
                }
                for (let week in schedule.data[location].monthlySchedule) {
                    for (let x = 0; x < diff; x++) {
                        schedule.data[location].monthlySchedule[week].pop()
                    }
                    let y = 0
                    for (let x = 0; x < schedule.data[location].monthlySchedule[week].length; x++) {
                        if (x === mismatchedTimings[y]) {
                            schedule.data[location].monthlySchedule[week][x] = 'TBD'
                            y++
                        }
                    }
                }
            } else {
                const tempSchedule = JSON.parse(JSON.stringify(schedule.data[location - 1]))
                tempSchedule.info = JSON.parse(JSON.stringify(locationAndTiming.options[location].info))
                tempSchedule.timing = locationAndTiming.options[location].timings
                const numberOfKhateebsPerWeek = tempSchedule.timing.length
                let emptyArray = []
                for (let x = 0; x < numberOfKhateebsPerWeek; x++) {
                    emptyArray.push('TBD')
                }
                for (let week in tempSchedule.monthlySchedule) {
                    tempSchedule.monthlySchedule[week] = emptyArray
                }
                schedule.data[location] = JSON.parse(JSON.stringify(tempSchedule))
            }
        }
        return schedule.data
    }
}
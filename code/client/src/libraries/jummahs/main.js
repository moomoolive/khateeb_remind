import datetime from '@/libraries/dateTime/main.js'
import helpers from './helpers.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

const buildMonthlySchedule = (date, locations, timings, fromBeginningOfMonth=false) => {
    const castedLocations = typeCheckingHelpers.castToArray(locations)
    const castedTimings = typeCheckingHelpers.castToArray(timings)
    const allFridaysInMonth = datetime.allUpcomingFridays(date, fromBeginningOfMonth)
    const jummahsForMonth = []
    castedLocations.filter(location => location.active).forEach(location => {
        castedTimings.filter(timing => timing.active && timing.locationID === location._id).forEach(timing => {
            allFridaysInMonth.forEach(date => {
                const jummah = helpers.createJummah(location, timing, date)
                jummahsForMonth.push(jummah)
            })
        })
    })
    return jummahsForMonth
}

const createMonthlyRequestRange = (date) => {
    const greaterThanEqual = new Date(date)
    greaterThanEqual.setDate(1)
    greaterThanEqual.setUTCHours(12, 0, 0, 0)
    const lesserThan = new Date(greaterThanEqual)
    lesserThan.setMonth(lesserThan.getMonth() + 1)
    return {
        $gte: greaterThanEqual.toISOString(),
        $lt: lesserThan.toISOString()
    }
}

export default {
    buildMonthlySchedule,
    createMonthlyRequestRange
}
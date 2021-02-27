import helpers from './helpers.js'

const upcomingFriday = (raw=false) => {
    const upcomingFriday = helpers.findUpcomingFriday()
    if (!raw) return {
        month: upcomingFriday.toLocaleString('default', { month: 'long' }),
        date: upcomingFriday.getDate(),
        year: upcomingFriday.getFullYear()
    }
    return upcomingFriday
}

const allUpcomingFridays = (input) => {
    const firstFriday = helpers.findFirstFridayOfMonth(input)
    return helpers.findAllFridaysInMonth(firstFriday)
}

// inputting 0 equates to the beginning of today
const daysInThePast = (numberOfDays=0) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - numberOfDays)
    return date
}

const monthsFromDate = (fixedDate, comparisonDate) => {
    const fixedDateObj = new Date(fixedDate)
    const comparisonDateObj = new Date(comparisonDate)
    if (helpers.sameMonthAndYear(fixedDateObj, comparisonDateObj))
        return 0
    else
        return 1
}

export default {
    upcomingFriday,
    allUpcomingFridays,
    daysInThePast,
    monthsFromDate
}

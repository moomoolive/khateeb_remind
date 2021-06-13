import helpers from './helpers.js'

const allUpcomingFridays = (input=new Date(), fromBeginningOfMonth=false) => {
    let inputDate = new Date(input)
    const friday = fromBeginningOfMonth ? helpers.findFirstFridayOfMonth(inputDate) :  helpers.findUpcomingFriday(inputDate)
    return helpers.findAllFridaysInMonth(friday)
}

// inputting 0 equates to the beginning of today
const daysInThePast = (numberOfDays=0) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - numberOfDays)
    return date
}

// number of months between fixed date and comparison date
// returns a signed integer
const monthsFromDate = (fixedDate, comparisonDate) => {
    const fixedDateObj = new Date(fixedDate)
    let comparisonDateObj = new Date(comparisonDate)
    if (!helpers.sameMonthSameYear(fixedDateObj, comparisonDateObj)) {
        return helpers.findMonthDifference(fixedDateObj, comparisonDateObj)
    } else {
        return 0
    }
}

const dateFormatYM = (date, includeDate=false) => {
    const format = new Date(date)
    let base = `${format.getFullYear()}-${format.getMonth() + 1}`
    if (includeDate) {
        base += `-${format.getDate()}`
    }
    return base
}

const sameDateMonthAndYear = (a=new Date(), b=new Date()) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return helpers.sameMonthSameYear(dateA, dateB) && dateA.getDate() === dateB.getDate()
}

const setDayOfWeek = (date=new Date(), dayOfWeek=4, nextWeek=true) => {
    const newDate = new Date(date)
    const increment = nextWeek ? 1 : -1
    while (newDate.getDay() !== dayOfWeek) {
        newDate.setDate(newDate.getDate() + increment)
    }
    return newDate
}

export default {
    allUpcomingFridays,
    daysInThePast,
    monthsFromDate,
    dateFormatYM,
    findUpcomingFriday: helpers.findUpcomingFriday,
    sameMonthSameYear: helpers.sameMonthSameYear,
    sameDateMonthAndYear,
    findFirstFridayOfMonth: helpers.findFirstFridayOfMonth,
    setDayOfWeek
}


import dayjs from 'dayjs'
import utcDayJs from 'dayjs/plugin/utc.js'
import timezonesDayJs from 'dayjs/plugin/timezone.js'
import objectSupportDayJs from 'dayjs/plugin/objectSupport.js'
dayjs.extend(utcDayJs)
dayjs.extend(timezonesDayJs)
dayjs.extend(objectSupportDayJs)

import helpers from './helpers.js'

const localizeToTimezone = (timezone, date) => {
    const localizeTime = dayjs(new Date(date)).tz(timezone, true)
    return new Date(localizeTime.toISOString())
}

const allUpcomingFridays = (input=new Date(), fromBeginningOfMonth=false, options={}) => {
    let inputDate = new Date(input)
    if (options && options.timezone)
        inputDate = localizeToTimezone(input, options.timezone)
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

const monthsFromDate = (fixedDate, comparisonDate) => {
    const fixedDateObj = new Date(fixedDate)
    let comparisonDateObj = new Date(comparisonDate)
    if (!helpers.sameMonthSameYear(fixedDateObj, comparisonDateObj))
        return helpers.findMonthDifference(fixedDateObj, comparisonDateObj)
    else
        return 0
}

const dateFormatYM = (date, includeDate=false) => {
    const format = new Date(date)
    let base = `${format.getFullYear()}-${format.getMonth() + 1}`
    if (includeDate)
        base += `-${format.getDate()}`
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
    while (newDate.getDay() !== dayOfWeek)
        newDate.setDate(newDate.getDate() + increment)
    return newDate
}

export default {
    allUpcomingFridays,
    daysInThePast,
    monthsFromDate,
    dateFormatYM,
    findUpcomingFriday: helpers.findUpcomingFriday,
    sameMonthSameYear: helpers.sameMonthSameYear,
    localizeToTimezone,
    sameDateMonthAndYear,
    findFirstFridayOfMonth: helpers.findFirstFridayOfMonth,
    setDayOfWeek
}


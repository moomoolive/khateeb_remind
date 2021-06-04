const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const helpers = require("./helpers.js")

// Returns a JS Date object set to current time in a particular timezone
// Supports all Moment.js timezones
const getDateInTimezoneNow = (timezone="America/Edmonton") => {
    return helpers.convertDayJsToJSDateObject(dayjs().tz(timezone))
}

// Returns a JS Date object set to inputted time in a particular timezone
// Supports all Moment.js timezones
const getSpecificDateInTimezone = (options={}) => {
    const backup = new Date()
    const localizedTime = dayjs()
        .tz(options.timezone || "America/Edmonton")
        .year(options.year || backup.getFullYear())
        .month(options.month || backup.getMonth())
        .date(options.date || backup.getDate())
        .hour(options.hour || backup.getHours())
        .minute(options.minute || backup.getMinutes())
        .second(options.second || backup.getSeconds())
        .millisecond(options.millisecond || backup.getMilliseconds())
    return helpers.convertDayJsToJSDateObject(localizedTime)
}

// finds next or previous day of week relative to a date
// returns inputted date if date corresponds to inputted day of week
const findDayOfWeek = (date=new Date(), dayOfWeek=4, nextWeek=true) => {
    const day = new Date(date)
    const increment = nextWeek ? 1 : -1
    while (day.getDay() !== dayOfWeek) {
        day.setDate(day.getDate() + increment)
    }
    return day
}

// finds the date of next friday 
// returns inputted date if it's a friday
const findUpcomingFriday = (date=new Date()) => {
    const friday = 5
    return findDayOfWeek(new Date(date), friday, true)
}

// finds the date of the first friday in a month
const findFirstFriday = (month, year) => {
    const x = new Date()
    const firstDayOfMonth = 1
    x.setFullYear(year)
    x.setMonth(month)
    x.setDate(firstDayOfMonth)
    return findUpcomingFriday(x)
}

// creates a date that mirrors input date, year, and month 
// with hours set to 12:00PM @UTC time
const toDBDateFormat = (date=new Date()) => {
    const input = new Date(date)
    const x = new Date()
    x.setUTCFullYear(input.getFullYear())
    x.setUTCMonth(input.getMonth())
    x.setUTCDate(input.getDate())
    x.setUTCHours(12, 0, 0, 0)
    return x
}

// finds upcoming friday in database format
// refer to db date format function
const findUpcomingFridayDBFormat = (date=new Date()) => {
    return toDBDateFormat(findUpcomingFriday(date))
}

// checks if two dates have the same date, month, and year
const sameMonthDateAndYear = (a=new Date(), b=new Date()) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getDate() === dateB.getDate() && helpers.sameMonthAndYear(dateA, dateB)
}

// find the number of fridays (jummahs) in a given month
// takes any date in target month as an argument
const numberOfJummahThisMonth = (date=new Date()) => {
    const firstFriday = findFirstFriday(date.getMonth(), date.getFullYear())
    const monthYearReference = new Date(firstFriday)
    let count = 0
    const week = 7
    while (helpers.sameMonthAndYear(monthYearReference, firstFriday)) {
        count++
        firstFriday.setDate(firstFriday.getDate() + week)
    }
    return count
}

module.exports = {
    findUpcomingFriday,
    findUpcomingFridayDBFormat,
    findFirstFriday,
    numberOfJummahThisMonth,
    findDayOfWeek,
    sameMonthDateAndYear,
    getDateInTimezoneNow,
    getSpecificDateInTimezone,
    toDBDateFormat
}
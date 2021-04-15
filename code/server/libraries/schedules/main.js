const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const objectSupport = require('dayjs/plugin/objectSupport')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)

const convertDayJsToJSDateObject = (dayJs=dayjs()) => {
    return new Date(
        dayJs.year(),
        dayJs.month(),
        dayJs.date(),
        dayJs.hour(),
        dayJs.minute(),
        dayJs.second(),
        dayJs.millisecond()
    )
}

const getDateInTimezoneNow = (timezone="America/Edmonton") => {
    return convertDayJsToJSDateObject(dayjs().tz(timezone))
}

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
    return convertDayJsToJSDateObject(localizedTime)
}

const findUpcomingFriday = (date=new Date()) => {
    const friday = 5
    const x = new Date(date)
    while (x.getDay() !== friday)
        x.setDate(x.getDate() + 1)
    return x
}

const findFirstFriday = (month, year) => {
    const x = new Date()
    x.setFullYear(year)
    x.setMonth(month)
    return findUpcomingFriday(x)
}

const toDBDateFormat = (date=new Date()) => {
    const input = new Date(date)
    const x = new Date()
    x.setUTCFullYear(input.getFullYear())
    x.setUTCMonth(input.getMonth())
    x.setUTCDate(input.getDate())
    x.setUTCHours(12, 0, 0, 0)
    return x
}

const findUpcomingFridayDBFormat = () => {
    return toDBDateFormat(findUpcomingFriday())
}

const sameMonthDateAndYear = (a=new Date(), b=new Date()) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getDate() === dateB.getDate() && dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
}

const numberOfJummahThisMonth = (date=new Date()) => {
    const upcomingFriday = findUpcomingFriday(date)
    const firstFriday = findFirstFriday(date.getMonth(), date.getFullYear())
    let count = 1
    const week = 7
    while (!sameMonthDateAndYear(upcomingFriday, firstFriday)) {
        firstFriday.setDate(firstFriday.getDate() + week)
        count++
    }
    return count
}

const findDayOfWeek = (date=new Date(), dayOfWeek=4, nextWeek=true) => {
    const day = new Date(date)
    const increment = nextWeek ? 1 : -1
    while (date.getDay() !== dayOfWeek)
        day.setDate(day.getDate() + increment)
    return day
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
}
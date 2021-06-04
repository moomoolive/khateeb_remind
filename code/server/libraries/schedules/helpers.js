const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const sameMonthAndYear = (a=new Date(), b=new Date()) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
}

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

module.exports = {
    sameMonthAndYear,
    convertDayJsToJSDateObject
}
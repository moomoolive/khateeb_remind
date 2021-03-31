const helpers = require('./helpers.js')

const findUpcomingFridayDBFormat = () => {
    const friday = new Date(helpers.findUpcomingFriday().toISOString())
    friday.setUTCHours(12, 0, 0, 0)
    return friday
}

const findFirstFriday = (month=2, year=2021) => {
    const dayjs = helpers.findFirstFriday(month, year)
    return new Date(dayjs.toISOString())
}

const sameMonthDateAndYear = (a=new Date(), b=new Date()) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getDate() === dateB.getDate() && dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
}

const numberOfJummahThisMonth = (date=new Date()) => {
    const dayjs = helpers.createDayJs({
        month: date.getMonth(),
        year: date.getFullYear(),
        date: date.getDate()
    })
    const upcomingFriday = new Date(helpers.findUpcomingFriday(dayjs).toISOString())
    const firstFriday = findFirstFriday(date.getMonth() + 1, date.getFullYear())
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
    findUpcomingFriday: helpers.findUpcomingFriday,
    findUpcomingFridayDBFormat,
    findFirstFriday,
    numberOfJummahThisMonth,
    findDayOfWeek
}
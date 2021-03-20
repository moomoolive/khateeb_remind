const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const objectSupport = require('dayjs/plugin/objectSupport')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)


const linkTimesAndLocations = (prayerInfo) => {
    const linkedStruct = {  }
    prayerInfo.locations.forEach(location => {
        linkedStruct[location._id] = []
    })
    prayerInfo.timings.forEach(timing => {
        linkedStruct[timing.locationID].push(timing._id)
    })
    return linkedStruct
}

const createDayJs = (options={}) => {
    const date = new Date()
    let dayJsOptions = {
        month: options.month || date.getMonth(),
        year: options.year || date.getFullYear(),
        date: options.date || date.getDate()
    }
    return dayjs().month(dayJsOptions.month).year(dayJsOptions.year).date(dayJsOptions.date)
}

const findUpcomingFriday = (date=dayjs()) => {
    const friday = 5
    while (date.day() !== friday)
        date = dayjs(date).date(date.date() + 1)
    return date
}

const findAllFridays = (startFridayDayJs, onlyDate=true) => {
    const fridays = []
    let fri = startFridayDayJs.clone()
    const oneWeek = 7
    while (fri.month() === startFridayDayJs.month()) {
        if (onlyDate)
            fridays.push(fri.date())
        else
            fridays.push(fri)
        fri = dayjs(fri).date(fri.date() + oneWeek)
    }
    return fridays
}

const getActiveLocationsAndTimings = async (institutionID) => {
    try {
        const query = { institutionID, active: true }
        const locations = await $db.locations.find(query).exec()
        const timings = await $db.timings.find(query).exec()
        return { locations, timings }
    } catch(err) {
        console.log(`Could not get locations and timings`)
        console.log(err)
    }
}


// Deprecated

const findFirstFriday = (month, year) => {
    let date = dayjs().month(month).year(year).date(1)
    return findUpcomingFriday(date)
}

const findNextMonth = () => {
    let date = dayjs()
    return dayjs(date).month(date.month() + 1)
}


module.exports = {
    getActiveLocationsAndTimings,
    findUpcomingFriday,
    findAllFridays,
    linkTimesAndLocations,
    createDayJs
}
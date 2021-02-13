const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const objectSupport = require('dayjs/plugin/objectSupport')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)

const createJummahsAndReturnEntries = async (emptyJummahArray) => {
    const jummahEntries = []
    for (let i = 0; i < emptyJummahArray.length; i++) {
        try {
            const jummah = await new $db.models.jummahs(emptyJummahArray[i]).save()
            jummahEntries.push(jummah)
        } catch(err) {
            console.log(err)
        }
    }
    return jummahEntries
}

const createEmptyJummahsEntries = (emptyJummah, prayerInfo, fridays, month, year, institutionID) => {
    const linkedTimesAndLocations = linkTimesAndLocations(prayerInfo)
    const emptyJummahs = loopOverLinkedStructAndFillJummahs(
        linkedTimesAndLocations, emptyJummah, fridays, month, year, institutionID
    )
    return emptyJummahs
}

const loopOverLinkedStructAndFillJummahs = (linkedStruct, emptyJummah, fridays, month, year, institutionID) => {
    const jummahArray = []
    for (let [locationID, timingIDs] of Object.entries(linkedStruct)) {
        fridays.forEach(friday => {
            timingIDs.forEach(timingID => {
                const jummah = _.deepCopy(emptyJummah)
                jummah.institutionID = institutionID
                jummah.month = month
                jummah.year = year
                jummah.weekOf = friday
                jummah.locationID = locationID
                jummah.timingID = timingID.toString()
                jummahArray.push(jummah)
            })
        })
    }
    return jummahArray
}

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

const getEmptyJummah = () => {
    const templates = getEmptyJummahComponents()
    return createEmptyJummah(templates)
}

const getEmptyJummahComponents = () => {
    const jummah = {
        month: 0,
        year: 2021,
        weekOf: 15,
        confirmed: false,
        institutionID: 'TBD',
        locationID: "TBD",
        timingID: 'TBD',
        khateebPreference: []
    }
    const prayerSlot = {
        notified: false,
        confirmed: false,
        responded: false,
        khateebID: 'TBD'
    }
    return { jummah, prayerSlot }
}

const createEmptyJummah = (templates) => {
    const maxKhateebPreference = 3
    for (let i =0; i < maxKhateebPreference; i++)
        templates.jummah.khateebPreference.push(templates.prayerSlot)
    return templates.jummah
}

const getActiveLocationsAndTimings = async (institutionID) => {
    try {
        const query = { institutionID, active: true }
        const locations = await $db.models.locations.find(query).exec()
        const timings = await $db.models.timings.find(query).exec()
        return { locations, timings }
    } catch(err) {
        console.log(`Could not get locations and timings`)
        console.log(err)
    }
}

const findFirstFriday = (month, year) => {
    let date = dayjs().month(month).year(year).date(1)
    return findUpcomingFriday(date)
}

const findNextMonth = () => {
    let date = dayjs()
    return dayjs(date).month(date.month() + 1)
}

const fridaysOfMonth = (month, year, onlyDate=true) => {
    const firstFriday = findFirstFriday(month, year)
    return findAllFridays(firstFriday, onlyDate)
}

const fridaysNextMonth = (onlyDate=true) => {
    const date = findNextMonth()
    return fridaysOfMonth(date.month(), date.year(), onlyDate)
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

const createAssociatedJummahKeys = (remainingJummahsDayJs, nextMonthJummahsDayJs, associatedKey) => {
    const allJummahs = [...remainingJummahsDayJs, ...nextMonthJummahsDayJs]
    const keys = []
    allJummahs.forEach(jummah => {
        const ID = _.deepCopy(associatedKey)
        const jummahKey = { ...ID }
        jummahKey.month = jummah.month()
        jummahKey.weekOf = jummah.date()
        jummahKey.year = jummah.year()
        keys.push(jummahKey)
    })
    return keys
}

module.exports = {
    fridaysOfMonth,
    getActiveLocationsAndTimings,
    getEmptyJummah,
    createEmptyJummahsEntries,
    createJummahsAndReturnEntries,
    findUpcomingFriday,
    findAllFridays,
    fridaysNextMonth,
    createAssociatedJummahKeys
}
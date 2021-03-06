const localToUTCEquivalent = (localTimeNow) => {
    const localTime = new Date(localTimeNow)
    const date = new Date()
    date.setUTCFullYear(localTime.getFullYear())
    date.setUTCMonth(localTime.getMonth())
    date.setUTCDate(1)
    return date
}

const oneMonthInThePast = (localTimeNow) => {
    const date = localToUTCEquivalent(localTimeNow)
    date.setUTCDate(date.getUTCDate() - 1)
    date.setUTCHours(23, 59, 59, 999)
    return date
}

const twoMonthsAhead = (localTimeNow) => {
    const date = localToUTCEquivalent(localTimeNow)
    date.setUTCMonth(date.getUTCMonth() + 2)
    date.setUTCHours(0, 0, 0, 0)
    return date
}


module.exports = {
    oneMonthInThePast,
    twoMonthsAhead
}
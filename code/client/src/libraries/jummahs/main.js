const createMonthlyRequestRange = (date) => {
    const greaterThanEqual = new Date(date)
    greaterThanEqual.setDate(1)
    greaterThanEqual.setUTCHours(12, 0, 0, 0)
    const lesserThan = new Date(greaterThanEqual)
    lesserThan.setMonth(lesserThan.getMonth() + 1)
    return {
        $gte: greaterThanEqual.toISOString(),
        $lt: lesserThan.toISOString()
    }
}

export default {
    createMonthlyRequestRange
}
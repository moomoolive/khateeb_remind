const fridayToFridayDBFormat = (date=new Date()) => {
    const dbFormat = new Date(date)
    dbFormat.setUTCDate(new Date(date).getDate())
    dbFormat.setUTCHours(12, 0, 0, 0)
    return dbFormat.toISOString()
}

const createMonthlyRequestRange = (date=new Date()) => {
    let greaterThanEqual = new Date(date)
    greaterThanEqual.setUTCDate(1)
    greaterThanEqual = fridayToFridayDBFormat(greaterThanEqual)
    const lesserThan = new Date(greaterThanEqual)
    lesserThan.setMonth(lesserThan.getMonth() + 1)
    return {
        $gte: greaterThanEqual,
        $lt: lesserThan.toISOString()
    }
}

export default {
    createMonthlyRequestRange,
    fridayToFridayDBFormat
}
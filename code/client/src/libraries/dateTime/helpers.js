const friday = 5

const sameMonthAndYear = (a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
}

const findMonthDifference = (fixedDateObj, comparisonDateObj) => {
    const fixedDateIsInFuture = fixedDateObj.getTime() > comparisonDateObj.getTime()
    const increment = fixedDateIsInFuture ? -1 : 1
    const startDate = new Date(fixedDateObj)
    const targetDate = new Date(comparisonDateObj)
    let count = 0
    while (!sameMonthAndYear(startDate, targetDate)) {
        startDate.setMonth(startDate.getMonth + increment)
        count += increment
    }
    return count
}

export default {
    findUpcomingFriday(date=new Date()) {
        while (date.getDay() !== friday) {
            date.setDate(date.getDate() + 1)
        }
        return date
    },
    findFirstFridayOfMonth(date=new Date()) {
        const firstDayOfMonth = 1
        date.setDate(firstDayOfMonth)
        return this.findUpcomingFriday(date)
    },
    findAllFridaysInMonth(firstFridayObj) {
        const currentMonth = firstFridayObj.getMonth()
        const oneWeek = 7
        const fridays = []
        while(firstFridayObj.getMonth() === currentMonth) {
            const oneFriday = new Date(firstFridayObj.getTime())
            fridays.push(oneFriday)
            firstFridayObj.setDate(firstFridayObj.getDate() + oneWeek)
        }
        return fridays
    },
    findMonthDifference,
    sameMonthAndYear
}
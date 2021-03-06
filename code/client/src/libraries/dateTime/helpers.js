const friday = 5

const sameMonthSameYear = (a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
}

const findMonthDifference = (fixedDateObj, comparisonDateObj) => {
    const increment = fixedDateObj.getTime() > comparisonDateObj.getTime() ? 1 : -1
    let difference = 0
    let isSameYearAndMonth = sameMonthSameYear(fixedDateObj, comparisonDateObj)
    while (!isSameYearAndMonth) {
        comparisonDateObj.setMonth(comparisonDateObj.getMonth() + increment)
        difference += (increment * -1)
        isSameYearAndMonth = sameMonthSameYear(fixedDateObj, comparisonDateObj)
    }
    return difference
}

const findUpcomingFriday = (date=new Date()) => {
    while (date.getDay() !== friday) {
        date.setDate(date.getDate() + 1)
    }
    return date
}

const findFirstFridayOfMonth = (date=new Date()) => {
    const firstDayOfMonth = 1
    date.setDate(firstDayOfMonth)
    return findUpcomingFriday(date)
}

const findAllFridaysInMonth = (firstFridayObj) => {
    const currentMonth = firstFridayObj.getMonth()
    const oneWeek = 7
    const fridays = []
    while(firstFridayObj.getMonth() === currentMonth) {
        const oneFriday = new Date(firstFridayObj.getTime())
        fridays.push(oneFriday)
        firstFridayObj.setDate(firstFridayObj.getDate() + oneWeek)
    }
    return fridays
}

export default {
    findAllFridaysInMonth,
    findFirstFridayOfMonth,
    findUpcomingFriday,
    sameMonthSameYear,
    findMonthDifference
}
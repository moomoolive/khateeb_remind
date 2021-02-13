const friday = 5

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
    }
}
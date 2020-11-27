const datetime = {
    monthList: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],
    weekDayList: [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday"
    ],
    upcomingFriday() {
        let upcomingFriday = new Date()
        const dayOfTheWeek = upcomingFriday.getDay()
        let dayCount = 0

        if (dayOfTheWeek !== 5) {
            const friday = 5
            const endOfWeek = 6
            for (let i = dayOfTheWeek; i !== friday; i++) {
                dayCount++
                if (i === endOfWeek) { i = -1 }
            }
            upcomingFriday.setDate(upcomingFriday.getDate() + dayCount)
        }

        const returnDate = {
            day: 'Friday',
            month: this.monthList[upcomingFriday.getMonth()],
            date: upcomingFriday.getDate(),
            year: upcomingFriday.getFullYear(),
            daysTill: dayCount
        }
        return returnDate
    },
    currentDate() {
        const x = new Date()
        const month = this.monthList[x.getMonth()]
        const year = x.getFullYear()
        const day = x.getDate()
        const dayOfTheWeek = this.weekDayList[x.getDay()]

        const returnDate = {
            month,
            year,
            day,
            dayOfTheWeek
          }
        
        return returnDate
    }
}

export default datetime


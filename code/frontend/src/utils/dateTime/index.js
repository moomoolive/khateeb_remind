import helpers from './helpers.js'

export default {
    upcomingFriday() {
        /*
        const upcomingFriday = helpers.findUpcomingFriday()
        return {
            blah blah blah
        }
        */
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
            dayOfTheWeek: 'Friday',
            month: upcomingFriday.toLocaleString('default', { month: 'long' }),
            date: upcomingFriday.getDate(),
            year: upcomingFriday.getFullYear(),
            daysTill: dayCount
        }
        return returnDate
    },
    allUpcomingFridays(input) {
        /*
        const firstFriday = helpers.findFirstFridayOfMonth()
        return helpers.findAllFridaysInMonth()
        */
        const date = new Date(input.getTime())
        let month = date.getMonth()
        let fridays = []
        date.setDate(1)

        const friday = 5
        while (date.getDay() !== friday) {
            date.setDate(date.getDate() + 1)
        }

        const monthName = date.toLocaleString('default', { month: 'long' })
        const year = date.getFullYear()
        const week = 7
        while (date.getMonth() === month) {
            let oneFriday = new Date(date.getTime()).getDate()
            fridays.push(`${oneFriday} ${monthName} ${year}`)
            date.setDate(date.getDate() + week)
        }
        return fridays
    }
}


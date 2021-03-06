import helpers from './helpers.js'

export default {
    upcomingFriday(raw=false) {
        const upcomingFriday = helpers.findUpcomingFriday()
        if (!raw) return {
            month: upcomingFriday.toLocaleString('default', { month: 'long' }),
            date: upcomingFriday.getDate(),
            year: upcomingFriday.getFullYear()
        }
        return upcomingFriday
    },
    allUpcomingFridays(input) {
        const firstFriday = helpers.findFirstFridayOfMonth(input)
        return helpers.findAllFridaysInMonth(firstFriday)
    }
}


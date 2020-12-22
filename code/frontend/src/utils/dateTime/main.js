import helpers from './helpers.js'

export default {
    upcomingFriday() {
        const upcomingFriday = helpers.findUpcomingFriday()
        return {
            month: upcomingFriday.toLocaleString('default', { month: 'long' }),
            date: upcomingFriday.getDate(),
            year: upcomingFriday.getFullYear()
        }
    },
    allUpcomingFridays(input) {
        const firstFriday = helpers.findFirstFridayOfMonth(input)
        return helpers.findAllFridaysInMonth(firstFriday)
    }
}


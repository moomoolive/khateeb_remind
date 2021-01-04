import general from '../funcs.js'

export default {
    createScheduleKey() {
        const upcomingFriday = general.findUpcomingFriday()
        const month = upcomingFriday.toLocaleString('default', { month: 'long' })
        return `${month}${upcomingFriday.getFullYear()}`
    }
}
import state from './state.js'

export default {
    khateebScheduleInfo(state, khateebScheduleInfo) {
        state.khateebSchedule.weeks = khateebScheduleInfo.weeks
        state.khateebSchedule.location = khateebScheduleInfo.location
    },
    dateInfo(state, dateInfo) {
        state.date.month = dateInfo.month
        state.date.day = dateInfo.day
        state.date.year = dateInfo.year
        state.date.dayOfTheWeek = dateInfo.dayOfTheWeek
    },
    upcomingFriday(state, info) {
        state.date.upcomingFriday = info
    }
}
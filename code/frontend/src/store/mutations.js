import state from './state.js'

export default {
    khateebScheduleInfo(state, khateebScheduleInfo) {
        state.khateebSchedule = khateebScheduleInfo
    },
    dateInfo(state, info) {
        state.date.currentDate = info.currentDateInfo
        state.date.upcomingFriday = info.upcomingFridayInfo
    }
}
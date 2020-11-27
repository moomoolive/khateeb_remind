export default {
    khateebScheduleInfo({ commit }, khateebScheduleInfo) {
        commit('khateebScheduleInfo', khateebScheduleInfo)
    },
    dateInfo({ commit }, dateInfo) {
        commit('dateInfo', dateInfo)
    },
    upcomingFriday({ commit }, info) {
        commit('upcomingFriday', info)
    }
}
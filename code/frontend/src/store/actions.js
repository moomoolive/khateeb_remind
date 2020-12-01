export default {
    khateebScheduleInfo({ commit }, khateebScheduleInfo) {
        commit('khateebScheduleInfo', khateebScheduleInfo)
    },
    dateInfo({ commit }, info) {
        commit('dateInfo', info)
    },
    JWT_TOKEN({ commit }, token) {
        commit('updateToken', token)
    },
    logout({ commit }) {
        commit('removeToken')
    }
}
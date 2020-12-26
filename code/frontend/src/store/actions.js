import axios from 'axios'

export default {
    dateInfo({ commit }, info) {
        commit('dateInfo', info)
    },
    JWT_TOKEN({ commit }, token) {
        commit('updateToken', token)
    },
    logout({ commit }) {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['authorization']
        commit('removeToken')
    },
    setLastVisit({ commit }, date) {
        commit('lastVisit', date)
    },
    adminSavedChangesScreen({ commit }, state) {
        commit('adminSavedChangesScreen', state)
    }
}
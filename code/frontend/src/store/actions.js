import axios from 'axios'

export default {
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
    },
    closeNotification({ commit }) {
        commit('closeNotification')
    },
    createNotification({ commit }, notificationsInfo) {
        commit('createNotification', notificationsInfo)
    },
    changeWallpaper({ commit }, newWallpaperName) {
        commit('changeWallpaper', newWallpaperName)
    },
    removeNotificationFromQueue({ commit }) {
        commit('removeNotificationFromQueue')
    },
    displayNotification({ commit }, notificationsInfo) {
        commit('displayNotification', notificationsInfo)
    },
    storeNotificationsFromAPI({ commit }, notificationsArray) {
        commit('storeNotificationsFromAPI', notificationsArray)
    },
    markNotificationAsSeen({ commit }, notificationId) {
        commit('markNotificationAsSeen', notificationId)
    },
    markNotificationActionAsComplete({ commit }, notificationId) {
        commit('markNotificationActionAsComplete', notificationId)
    }
}
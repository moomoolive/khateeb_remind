export default {
    adminSavedChangesScreen({ commit }, state) {
        commit('adminSavedChangesScreen', state)
    },
    closeNotification({ commit }) {
        commit('closeNotification')
    },
    createNotification({ commit }, notificationsInfo) {
        commit('createNotification', notificationsInfo)
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
    },
    showSiteBanner({ commit }) {
        commit('showSiteBanner')
    },
    hideSiteBanner({ commit }) {
        commit('hideSiteBanner')
    },
    storeUserPackage({ commit }, userPackage) {
        commit('storeUserPackage', userPackage)
    }
}
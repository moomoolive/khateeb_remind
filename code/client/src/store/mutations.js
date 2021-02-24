import state from './state.js'

export default {
    adminSavedChangesScreen(state, onOrOff) { 
        state.admin.savedChanges = onOrOff 
    },
    closeNotification(state) { 
        state.notifications.show = false
        state.notificationsQueue.shift()
        if (!state.notifications.options.notificationOrigin)
            state.userPromptedNotifications.shift()
    },
    createNotification(state, notificationsInfo) {
        if (!notificationsInfo.options.notificationOrigin) {
            if (state.userPromptedNotifications.length < 1) {
                state.userPromptedNotifications.push(notificationsInfo)
                state.notificationsQueue.push('__USER__')
            }
        } else
            state.notificationsQueue.push(notificationsInfo) 
    },
    displayNotification(state, notificationsInfo) { 
        state.notifications.show = true
        state.notifications.type = notificationsInfo.type
        state.notifications.options = notificationsInfo.options
    },
    storeNotificationsFromAPI(state, notificationsArray) {
        state.notificationsFromServer = notificationsArray
    },
    markNotificationAsSeen(state, notificationId) {
        const found = state.notificationsFromServer.find(note => note._id === notificationId)
        found.seen = true
    },
    markNotificationActionAsComplete(state, notificationId) {
        const found = state.notificationsFromServer.find(note => note._id === notificationId)
        found.actionPerformed = true
    },
    hideSiteBanner(state) {
        state.siteBanner.show = false
    },
    showSiteBanner(state) {
        state.siteBanner.show = true
    },
    storeUserPackage(state, userPackage) {
        state.notificationsFromServer = userPackage.notifications
    }
}
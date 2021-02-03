import state from './state.js'

export default {
    updateToken(state, token) { state.JWT_TOKEN = token },
    removeToken(state) { state.JWT_TOKEN = null },
    lastVisit(state, date) { state.lastVisit = date },
    adminSavedChangesScreen(state, onOrOff) { state.admin.savedChanges = onOrOff },
    closeNotification(state) { 
        state.notifications.show = false
        state.notificationsQueue.shift()
        if (!state.notifications.options.notificationOrigin)
            state.userPromptedNotifications.shift()
    },
    createNotification(state, notificationsInfo) { 
        if (!notificationsInfo.notificationOrigin) {
            if (state.userPromptedNotifications.length < 1) {
                state.userPromptedNotifications.push(notificationsInfo)
                state.notificationsQueue.push('__USER__')
            }
        } else
            state.notificationsQueue.push(notificationsInfo) 
    },
    changeWallpaper(state, newWallpaperName) { state.wallpaper = newWallpaperName },
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
    }
}
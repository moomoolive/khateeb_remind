import state from './state.js'

export default {
    khateebScheduleInfo(state, khateebScheduleInfo) {
        state.khateebSchedule = khateebScheduleInfo
    },
    dateInfo(state, info) {
        state.date.upcomingFriday = info.upcomingFridayInfo
    },
    updateToken(state, token) { state.JWT_TOKEN = token },
    removeToken(state) { state.JWT_TOKEN = null },
    lastVisit(state, date) { state.lastVisit = date },
    adminSavedChangesScreen(state, onOrOff) { state.admin.savedChanges = onOrOff },
    closeNotification(state) { 
        state.notifications.show = false
        state.notificationsQueue.shift() 
    },
    createNotification(state, notificationsInfo) { 
        state.notificationsQueue.push(notificationsInfo)
    },
    changeWallpaper(state, newWallpaperName) { state.wallpaper = newWallpaperName },
    displayNotification(state, notificationsInfo) { 
        state.notifications.show = true
        state.notifications.type = notificationsInfo.type
        state.notifications.options = notificationsInfo.options
    }
}
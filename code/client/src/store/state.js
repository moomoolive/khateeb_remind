export default {
    JWT_TOKEN: localStorage.getItem('token') || null,
    lastVisit: null,
    admin: {
        savedChanges: false
    },
    notifications: {
        show: false,
        type: 'none',
        options: {} 
    },
    notificationsQueue: [],
    userPromptedNotifications: [],
    wallpaper: 'main',
    notificationsFromServer: [],
    landingPage: null,
    siteBanner: {
        show: false
    },
    institutionInfo: null
}
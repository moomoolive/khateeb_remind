export default {
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
    notificationsFromServer: [],
    siteBanner: {
        show: false
    },
    isPWA: window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
}
export default {
    date: {
        upcomingFriday: {
            dayOfTheWeek: null,
            month: null,
            date: null,
            year: null,
            daysTill: null
        }
    },
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
    notificationsFromServer: []
}
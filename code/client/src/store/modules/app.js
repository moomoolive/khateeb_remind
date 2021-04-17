export default {
    namespaced: true,
    state: () => ({
        wallpaper: 'main',
        isOffline: false,
        hasLoggedInViaLoginPage: false
    }),
    mutations: {
        changeWallpaper(state, targetWallpaper) {
            state.wallpaper = targetWallpaper
        },
        loggedInViaLoginPage(state) {
            state.hasLoggedInViaLoginPage = true
        },
        offlineMode(state) {
            state.isOffline = true
        },
        backOnline(state) {
            state.isOffline = false
        }
    },
    actions: {
        
    } 
}
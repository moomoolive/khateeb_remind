export default {
    namespaced: true,
    state: () => ({
        wallpaper: 'main',
        isOffline: false,
        assignedUserPackage: true,
        hasLoggedInViaLoginPage: false
    }),
    mutations: {
        changeWallpaper(state, targetWallpaper) {
            state.wallpaper = targetWallpaper
        },
        successfullyAssignedUserPackage(state) {
            state.assignedUserPackage = true
        },
        loggedInViaLoginPage(state) {
            state.hasLoggedInViaLoginPage = true
        },
        offlineMode(state) {
            state.isOffline = true
        }
    },
    actions: {
        
    } 
}
export default {
    namespaced: true,
    state: () => ({
        wallpaper: 'main',
        usingOffline: false, // TBD
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
        }
    },
    actions: {
        
    } 
}
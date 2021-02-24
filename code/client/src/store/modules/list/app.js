export default {
    namespaced: true,
    state: () => ({
        wallpaper: 'main',
        usingOffline: false
    }),
    mutations: {
        changeWallpaper(state, targetWallpaper) {
            state.wallpaper = targetWallpaper
        }
    },
    actions: {
        
    } 
}
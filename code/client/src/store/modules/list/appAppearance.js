export default {
    namespaced: true,
    state: () => ({
        wallpaper: 'main'
    }),
    mutations: {
        changeWallpaper(state, targetWallpaper) {
            state.wallpaper = targetWallpaper
        }
    },
    actions: {
        
    } 
}
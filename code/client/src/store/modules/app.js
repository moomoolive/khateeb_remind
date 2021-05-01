export default {
    namespaced: true,
    state: () => ({
        isOffline: false,
        hasLoggedInViaLoginPage: false
    }),
    mutations: {
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
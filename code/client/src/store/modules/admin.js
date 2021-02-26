export default {
    namespaced: true,
    state: () => ({
        savedChanges: false
    }),
    mutations: {
        showSavedChangesScreen(state) {
            state.savedChanges = true
        },
        hideSavedChangesScreen(state) {
            state.savedChanges = false
        }
    },
    actions: {
        
    } 
}
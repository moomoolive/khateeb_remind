export default {
    namespaced: true,
    state: () => ({
        landingPage: '/',
        firstPage: true
    }),
    mutations: {
        registerLandingPage(state, landingPageFullURL) {
            state.landingPage = landingPageFullURL
        },
        userHasLanded(state) {
            state.firstPage = false
        }
    },
    actions: {
        registerLandingPage({ commit }, landingPageFullURL) {
            commit('registerLandingPage', landingPageFullURL)
            commit('userHasLanded')
        }
    } 
}
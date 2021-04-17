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
            // I chose fifty milliseconds because it allows me to use the
            // firstPage variable in created hooks of views
            const milliseconds = 50
            window.setTimeout(() => commit('userHasLanded'), milliseconds)
        }
    } 
}
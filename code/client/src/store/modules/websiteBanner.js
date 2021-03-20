export default {
    namespaced: true,
    state: () => ({
        show: false
    }),
    mutations: {
        hide(state) {
            state.show = false
        },
        show(state) {
            state.show = true
        }
    }
}
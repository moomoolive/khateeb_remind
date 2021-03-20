export default {
    namespaced: true,
    state: () => ({
        show: false,
        options: {
            type: 'statusUpdate',
            componentsProps: {
                topMessage: "Updating...",
                gif: "loading"
            }
        }
    }),
    mutations: {
        display(state, { type, componentsProps }) {
            state.show = true
            state.options.type = type
            state.options.componentsProps = componentsProps
        },
        close(state) {
            state.show = false
        }
    },
    actions: {
        
    } 
}

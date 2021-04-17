import typeCheckingHelpers from '@/libraries/typeChecking/main.js'
import requestManagerHelpers from '@/libraries/requests/requestManager/main.js'

export default {
    namespaced: true,
    state: () => ({
        queue: [],
        responses: {},
        noResFromXHRinLast30Seconds: 0
    }),
    mutations: {
        addToQueue(state, request) {
            state.queue.push(request)
        },
        noResFromXHR(state) {
            state.noResFromXHRinLast30Seconds++
        },
        clearNoResCount(state) {
            state.noResFromXHRinLast30Seconds = 0
        },
        shiftQueue(state) {
            state.queue.shift()
        },
        storeResponsePromise(state, key) {
            state.responses[key] = { }
            state.responses[key].promise = new Promise((resolve, reject) => {
                state.responses[key].resolve = resolve
                state.responses[key].reject = reject
            })
        },
        removeResponse(state, key) {
            delete state.responses[key]
        }
    },
    actions: {
        addToQueue({ commit }, requestInfo) {
            return new Promise((resolve, reject) => {
                if (!typeCheckingHelpers.isAnObject(requestInfo) || Object.keys(requestInfo).length < 1)
                    throw TypeError(`Invalid Request Options`)
                const requestId = requestManagerHelpers.requestId(requestInfo)
                if (!this.state.requests.responses[requestId])
                    commit('storeResponsePromise', requestManagerHelpers.requestId(requestInfo))
                commit('addToQueue', { ...requestInfo, responsePromiseIsReady: resolve, error: reject })
            })
        },
    },
    getters: {

    }
}
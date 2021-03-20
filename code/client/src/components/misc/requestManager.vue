<template>
    <div></div>
</template>

<script>
import helpers from '@/libraries/requests/requestManager/main.js'

export default {
    name: 'requestManager',
    data() {
        return {
            activeRequests: {}
        }
    },
    methods: {
        createActiveRequest(requestKey, requestInfo) {
            const key = requestKey
            const targetFunction = this.$API[requestInfo.extension][requestInfo.function]
            const args = requestInfo.arguments
            const millisecondsInASecond = 1_000
            const timeInMilliseconds = requestInfo.requestAfterSeconds * millisecondsInASecond
            const fiveSecondsInMilliseconds = 5_000
            const resolve = this.$store.state.requests.responses[key].resolve
            const reject = this.$store.state.requests.responses[key].reject
            const fullfilledResponseCallback = {
                func: this.deactivateRequestAndDestroyResponse,
                key
            }
            const func = window.setTimeout(async () => {
                try {
                    const res = await targetFunction(...args)
                    resolve(res)
                    fullfilledResponseCallback.func(fullfilledResponseCallback.key)
                } catch(err) {
                    console.log(err)
                    reject(err)
                }
            }, timeInMilliseconds || fiveSecondsInMilliseconds)
            this.activeRequests[key] = { func, clearCount: 0 }
            requestInfo.responsePromiseIsReady(true)
        },
        clearRequest(requestKey) {
            window.clearTimeout(this.activeRequests[requestKey].func)
            this.activeRequests[requestKey].clearCount++
        },
        deactivateRequestAndDestroyResponse(key) {
            this.$store.commit('requests/removeResponse', key)
            delete this.activeRequests[key]
        }
    },
    computed: {
        requestsQueue() {
            return this.$store.state.requests.queue
        },
    },
    watch: {
        async requestsQueue(newVal) {
            if (newVal.length < 1)
                return
            const request = { ...newVal[0] }
            this.$store.commit('requests/shiftQueue')
            const requestKey = helpers.requestId(request)
            if (this.activeRequests[requestKey] !== undefined)
                this.clearRequest(requestKey)
            this.createActiveRequest(requestKey, request)
        }
    }
}
</script>

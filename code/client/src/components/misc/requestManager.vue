<template>
    <div></div>
</template>

<script>
import helpers from '@/libraries/requests/requestManager/main.js'
import footerPopups from '@/libraries/footerPopup/main.js'

import Config from '$config'

export default {
    name: 'requestManager',
    data() {
        return {
            activeRequests: {}
        }
    },
    methods: {
        createActiveRequest(requestKey, requestInfo) {
            if (this.offlineModeIsInitiated)
                return this._utils.alert(`You cannot make changes when you are in offline mode, try again later!`)
            const key = requestKey
            const targetFunction = this._api[requestInfo.extension][requestInfo.function]
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
        },
        async pingHealthEndpointPerodically() {
            const res = await this._api.misc.healthEndpoint()
            if (res) {
                this.$store.commit('app/backOnline')
                footerPopups.backOnline()
                const fiveSecondsInMilliseconds = 6_000
                window.setTimeout(() => window.location.reload(), fiveSecondsInMilliseconds)
            }
            else {
                const tenSecondsInMilliseconds = 10_000
                window.setTimeout(() => this.pingHealthEndpointPerodically(), tenSecondsInMilliseconds)
            }
        }
    },
    computed: {
        requestsQueue() {
            return this.$store.state.requests.queue
        },
        noResponseFromServerRequestsLast30Seconds() {
            return this.$store.state.requests.noResFromXHRinLast30Seconds
        },
        offlineModeIsInitiated() {
            return this.$store.state.app.isOffline
        }
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
        },
        noResponseFromServerRequestsLast30Seconds(newVal, oldVal) {
            const thirtySecondsInMilliseconds = 30_000
            if (newVal === 1 && oldVal === 0)
                window.setTimeout(() => this.$store.commit('requests/clearNoResCount'), thirtySecondsInMilliseconds)
            if (newVal > Config.networkConfig.offlineModeRequestCountThreshold && !this.offlineModeIsInitiated) {
                footerPopups.youAreOffline()
                this.$store.commit("app/offlineMode")
            }
        },
        offlineModeIsInitiated(newVal, oldVal) {
            if (newVal && !oldVal)
                this.pingHealthEndpointPerodically()
        }
    }
}
</script>

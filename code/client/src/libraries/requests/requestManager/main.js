import helpers from './helpers.js'
import store from '@/store/index.js'

const requestId = (requestInfo) => {
    return `${requestInfo.extension}-${requestInfo.function}${helpers.additionalIdentification(requestInfo)}`
}

const response = async (requestInfo) => {
    await store.dispatch('requests/addToQueue', requestInfo)
    return store.state.requests.responses[requestId(requestInfo)].promise
}

export default {
    requestId,
    response
}
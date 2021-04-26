import axios from 'axios'

import store from '@/store/index.js'
import _utils from '@/libraries/globalUtilities.js'

const offlineModeRequestCanceler = axios.CancelToken

const normalRequest = (config ={}) => {
    const isNotGetRequest = config.method.toLowerCase() !== 'get'
    if (store.state.app.isOffline && isNotGetRequest) {
        console.log('hi')
        const cancelToken = offlineModeRequestCanceler.source()
        config.cancelToken = cancelToken
        cancelToken.cancel(`Only get requests are allowed when app is offline!`)
        _utils.alert(`You cannot make changes during offline mode, try again when your internet reconnects!`)
    }
    return config
}

export default {
    normalRequest
}
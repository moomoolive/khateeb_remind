import axios from 'axios'

import store from '@/store/index.js'
import utils from '@/libraries/globalUtilities.js'

const offlineModeRequestCanceler = axios.CancelToken

const normalRequest = (config ={}) => {
    const cancelToken = offlineModeRequestCanceler.source()
    const isNotGetRequest = config.method.toLowerCase() !== 'get'
    if (isNotGetRequest)
        config.cancelToken = cancelToken
    if (store.state.app.isOffline && isNotGetRequest) {
        cancelToken.cancel(`Only get requests are allowed when app is offline!`)
        utils.alert(`You cannot make changes during offline mode, try again when your internet reconnects!`)
    }
    return config
}

export default {
    normalRequest
}
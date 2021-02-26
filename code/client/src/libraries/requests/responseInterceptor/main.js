import store from '@/store/index.js'

import helpers from './helpers.js'

const normalResponse = res => res.data

const errorResponse = err => {
    const responseExtenstion = helpers.responseExtenstion(err.response)
    if (!err.response) {
        store.dispatch('notifications/create', helpers.serverErrorNotificationTemplate())
        return Promise.reject(err)
    }
    if (responseExtenstion === '/user/check-in')
        return Promise.reject(err)
    else if (err.response.status === 401) {
        if (responseExtenstion === 'auth/')
            return Promise.reject(err.response)
        else {
            store.dispatch('notifications/create', helpers.unauthorizedNotificationTemplate())
            return Promise.reject(err)
        }
    }
    else {
        store.dispatch('notifications/create', helpers.serverErrorNotificationTemplate())
        return Promise.reject(err)
    }
}

export default {
    normalResponse,
    errorResponse
}
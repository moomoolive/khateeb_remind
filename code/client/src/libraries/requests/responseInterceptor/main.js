import helpers from './helpers.js'
import notificationHelpers from '@/libraries/notifications/main.js'

const normalResponse = res => res.data

const errorResponse = err => {
    const responseExtenstion = helpers.responseExtenstion(err.response)
    if (/logos/.test(responseExtenstion) && err.response.config.method === 'get')
        return
    console.log(err)
    if (!err.response) {
        notificationHelpers.generalServerError()
        return Promise.reject(err)
    }
    if (responseExtenstion === '/user/check-in')
        return Promise.reject(err)
    if (err.response.status === 503) {
        notificationHelpers.serverCaughtError()
        return err.response.data
    }
    else if (err.response.status === 401) {
        if (responseExtenstion === 'auth/')
            return Promise.reject(err.response)
        else {
            notificationHelpers.unauthorizedMsg()
            return Promise.reject(err)
        }
    }
    notificationHelpers.generalServerError()
    return Promise.reject(err)
}

export default {
    normalResponse,
    errorResponse
}
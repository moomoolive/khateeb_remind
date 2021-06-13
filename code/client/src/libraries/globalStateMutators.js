import store from '@/store/index.js'
import router from '@/router/index.js'

import routerHelpers from '@/libraries/router/main.js'
import requestManagerHelpers from '@/libraries/requests/requestManager/main.js'
import notificationHelpers from '@/libraries/notifications/main.js'
import authHelpers from '@/libraries/auth/main.js'

function alert(msg, type="caution", options) {
    const info = {
        icon: type === 'caution' ? "exclamation-triangle" : 'check',
        color: type === 'caution' ? "yellow" : 'green',
        ...options
    }
    notificationHelpers.popupMsg(msg, info)
}

function confirm(msg, color="yellow", options) {
    return notificationHelpers.confirmationPrompt(msg, { color, ...options })
}

function toHomePage() {
    return router.push(routerHelpers.homepageURL(store.getters["user/type"]))
}

async function delayedRequest(routeModuleName, functionName, options={}) {
    const requestInfo = { 
        extension: routeModuleName,
        function: functionName,
        arguments: options.arguments || [],
        requestAfterSeconds:  options.requestAfterSeconds || 5,
        additionalIdentifiers: options.additionalIdentifiers || []
    }
    const res = await requestManagerHelpers.response(requestInfo)
    return res
}

function validAuthentication(authOptions={}) {
    return authHelpers.validUserAuthentication(store.getters['user/type'], authOptions)
}

export default {
    alert,
    confirm,
    toHomePage,
    delayedRequest,
    validAuthentication
}
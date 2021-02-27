import store from '@/store/index.js'
import router from '@/router/index.js'

import routerHelpers from '@/libraries/router/main.js'
import authHelpers from '@/libraries/auth/main.js'
import stringHelpers from '@/libraries/stringOperations/main.js'
import dateTimeHelpers from '@/libraries/dateTime/main.js'
import requestManagerHelpers from '@/libraries/requests/requestManager/main.js'
import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    deepCopy(item) {
        return JSON.parse(JSON.stringify(item))
    },
    stringFormat(string, format='camel', outputCase='title', raw=false) {
        const casedArray = stringHelpers[format + `CaseToArray`](string)
        return stringHelpers.arrayToString(casedArray, outputCase, raw)
    },
    isNumeric(value) {
        return /^\d+$/.test(value)
    },
    alert(msg, type="caution", options) {
        const info = {
            icon: type === 'caution' ? "exclamation" : 'success',
            color: type === 'caution' ? "yellow" : 'green',
            ...options
        }
        notificationHelpers.popMsg(msg, info)
    },
    confirm(msg, color="yellow", options) {
        return notificationHelpers.confirmationPrompt(msg, { color, ...options })
    },
    toHomePage() {
        return router.push(routerHelpers.homepageURL(store.getters["user/type"]))
    },
    dynamicDisplayDate(date) {
        const displayDate = new Date(date)
        const base = displayDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        if (displayDate.getTime() > dateTimeHelpers.daysInThePast(0).getTime())
            return base
        if (displayDate.getTime() > dateTimeHelpers.daysInThePast(1).getTime())
            return `Yesterday ${base}`
        if (displayDate.getTime() > dateTimeHelpers.daysInThePast(5).getTime())
            return `${displayDate.toLocaleString('en-US', { weekday: 'short' })} ${base}`
        return `${displayDate.toLocaleDateString('en-US')} ${base}`
    },
    validAuthentication(authOptions={}) {
        return authHelpers.validUserAuthentication(store.getters['user/type'], authOptions)
    },
    async delayedRequest(routeModuleName, functionName, options={}) {
        const requestInfo = { 
            extension: routeModuleName,
            function: functionName,
            arguments: options.arguments || [],
            requestAfterSeconds:  options.requestAfterSeconds || 10,
            additionalIdentifiers: options.additionalIdentifiers || []
        }
        const res = await requestManagerHelpers.response(requestInfo)
        return res
    }
}
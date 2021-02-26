import store from '@/store/index.js'
import router from '@/router/index.js'

import routerHelpers from '@/libraries/router/main.js'
import authHelpers from '@/libraries/auth/main.js'
import stringHelpers from '@/libraries/stringOperations/main.js'
import dateTimeHelpers from '@/libraries/dateTime/main.js'

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
    tutorial(category, number, fromSystem=false) {
        const info = {
            type: "tutorial",
            options: {
                category,
                number,
                color: "grey"
            }
        }
        if (fromSystem)
            info.options.notificationOrigin = 'web-app'
        store.dispatch('notifications/create', info)
    },
    alert(msg, type="caution", options) {
        const notificationInfo = {
            type: 'alert',
            options: {
                textSize: "small",
                icon: type === 'caution' ? "exclamation" : 'success',
                color: type === 'caution' ? "yellow" : 'green',
                msg,
                ...options
            }
        }
        store.dispatch('notifications/create', notificationInfo)
    },
    confirm(msg, color="yellow", options) {
        return new Promise((resolve) => {
            const info = {
                type: 'confirm',
                options: { 
                    msg,
                    color,
                    ...options,
                    resolve,
                    reject: resolve 
                }
            }
            store.dispatch('notifications/create', info)
        })
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
    }
}
import helpers from './helpers.js'
import store from '@/store/index.js'
import router from '@/router/index.js'

import routerHelpers from '@/utils/router.js'

export default {
    deepCopy(item) {
        return JSON.parse(JSON.stringify(item))
    },
    stringFormat(string, format='camel', outputCase='title', raw=false) {
        const casedArray = helpers[format + `CaseToArray`](string)
        return helpers.arrayToString(casedArray, outputCase, raw)
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
        store.dispatch('createNotification', info)
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
        store.dispatch('createNotification', notificationInfo)
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
            store.dispatch('createNotification', info)
        })
    },
    toHomePage() {
        return router.push(routerHelpers.homepageURL(store.getters["user/type"]))
    },
    dynamicDisplayDate(date) {
        const displayDate = new Date(date)
        const base = displayDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        if (displayDate.getTime() > helpers.daysInThePast(0).getTime())
            return base
        if (displayDate.getTime() > helpers.daysInThePast(1).getTime())
            return `Yesterday ${base}`
        if (displayDate.getTime() > helpers.daysInThePast(5).getTime())
            return `${displayDate.toLocaleString('default', { weekday: 'short' })} ${base}`
        return `${displayDate.toLocaleDateString('en-US')} ${base}`
    }
}
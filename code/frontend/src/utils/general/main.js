import helpers from './helpers.js'
import store from '@/store/index.js'

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
    alert(msg, color="yellow") {
        const notificationInfo = {
            type: 'alert',
            options: {
                textSize: "small",
                icon: "exclamation",
                color,
                msg
            }
        }
        store.dispatch('createNotification', notificationInfo)
    },
    confirm(msg) {
        return new Promise((resolve) => {
            const info = {
                type: 'confirm',
                options: { 
                    msg,
                    resolve,
                    reject: resolve 
                }
            }
            store.dispatch('createNotification', info)
        })
    },
    authRequirementsSatisfied(requiredAuthLevel) {
        const authLevels = {
            "khateeb": 1,
            "institutionAdmin": 2,
            "sysAdmin": 3,
            "root": 4
        }
        if (!store.getters.tokenExists)
            return false
        const currentUserType = store.getters.decodedJWT.__t
        const userAuthLevel = authLevels[currentUserType]
        return userAuthLevel >= requiredAuthLevel
    }
}
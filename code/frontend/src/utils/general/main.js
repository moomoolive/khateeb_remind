import helpers from './helpers.js'
import store from '@/store/index.js'
import router from '@/router/index.js'

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
    alert(msg, type="caution") {
        const notificationInfo = {
            type: 'alert',
            options: {
                textSize: "small",
                icon: type === 'caution' ? "exclamation" : 'success',
                color: type === 'caution' ? "yellow" : 'green',
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
                    color: 'yellow',
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
            "rootInstitutionAdmin": 3,
            "sysAdmin": 4,
            "root": 5
        }
        if (!store.getters.tokenExists)
            return false
        const currentUserType = store.getters.decodedJWT.__t
        const userAuthLevel = authLevels[currentUserType]
        return userAuthLevel >= requiredAuthLevel
    },
    toHomePage() {
        const token = store.getters.decodedJWT
        if (!token) {
            router.push('/')
            return
        }
        let destintation
        const user = token.__t
        if (user === 'root')
            destintation = '/sysAdmin'
        else if (user === 'rootInstitutionAdmin')
            destintation = '/institutionAdmin'
        else
            destintation = `/${user}`
        router.push(destintation)
    },

}
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
    tutorial(category, number) {
        const info = {
            type: "tutorial",
            options: {
                category,
                number,
                color: "grey"
            }
        }
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
        if (router.currentRoute.fullPath !== destintation)
            router.push(destintation)
    },
    dynamicDisplayDate(date) {
        date = new Date(date)
        const amOrPm = date.getHours() > 11 ? 'PM' : 'AM'
        const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
        const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let base = `${hours}:${mins} ${amOrPm}`
        const yesterday = new Date()
        yesterday.setHours(0, 0, 0, 0)
        if (date.getTime() > yesterday.getTime())
            return base
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 1)
        twoDaysAgo.setHours(0, 0, 0, 0)
        if (date.getTime() > twoDaysAgo.getTime())
            return `Yesterday ${base}`
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 5)
        lastWeek.setDate(0, 0, 0, 0)
        if (date.getTime() > lastWeek.getTime())
            return `${date.toLocaleString('default', { weekday: 'short' })} ${base}`
        const locale = date.toLocaleString().split(',')[0]
        return `${locale} ${base}`
    }
}
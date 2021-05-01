import helpers from './helpers.js'
import store from '@/store/index.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'
import localStorageHelpers from '@/libraries/localStorageManagement/main.js'

import axios from 'axios'

const extension = helpers.targetURL('user')

const requests = {
    async updateInfo(updates={}) {
        try {
            const res = await axios.put(extension + '/', updates)
            if (!res || !typeCheckingHelpers.isAnObject(res.data))
                return { data: null }
            store.commit('user/updateUserInfo', res.data)
            return res
        } catch {
            return { data: null }
        }
    },
    async checkIn() {
        let userPackage = { 
            notifications: [],
            institution: { name: "Random institution", abbreviatedName: "Rand Inst" },
            userInfo: {
                __t: "khateeb",
                _id: "1234",
                confirmed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                institutionID: "1234",
                lastLogin: new Date(),
                firstName: "random",
                lastName: "random",
                username: "randomUser",
                handle: "random"
            }
        }
        try {
            const res = await axios.get(extension + '/check-in')
            if (res && res.notifications && res.institution && res.userInfo) {
                userPackage = res
                localStorageHelpers.commit('cachedUserCheckIn', res)
            }
        } catch {
            const cachedUserCheckIn = localStorageHelpers.get('cachedUserCheckIn')
            if (cachedUserCheckIn)
                userPackage = cachedUserCheckIn
        }
        await store.dispatch('storeUserPackage', userPackage)
    },
    deleteAccount() {
        return helpers.returnEmptyObjectFromRequest("delete", "user")
    },
    async upgradeAuthorization(info={}) {
        try {
            const res = await axios.post(extension + '/upgrade-auth', info)
            if (!res || !typeCheckingHelpers.isJWT(res.token)) {
                throw TypeError(`Server didn't respond with JWT`)
            } else {
                return res
            }
        } catch {
            return { token: null }
        }
    },
    async downgradeAuthorization() {
        try {
            const res = await axios.get(extension + '/downgrade-auth')
            if (!res || !typeCheckingHelpers.isJWT(res.token)) {
                throw TypeError(`Server didn't respond with JWT`)
            } else {
                return res
            }
        } catch {
            return { token: null }
        }
    },
    async getNotifications() {
        const notifications = await helpers.returnArrayFromRequest('get', ['user', 'notifications'])
        return store.commit('notifications/stashServerNotifications', notifications)
    },
    getUserAuthorizations() {
        return helpers.returnEmptyObjectFromRequest('get', ['user', 'authorizations'])
    },
    updateNotification(updatedNotification) {
        return axios.put(extension + '/notification', updatedNotification)
    },
    async addAuthorization(info={}) {
        try {
            const res = await axios.post(extension + '/add-auth', info)
            if (!res || isNaN(res.code)) {
                return 2
            }
            return res.code
        } catch {
            return 1
        }
    },
    async removeAuthorization(info={}) {
        try {
            const res = await axios.post(extension + '/remove-auth', info)
            if (!res || isNaN(res.code)) {
                return 2
            }
            return res.code
        } catch {
            return 1
        }
    }
}

export default requests

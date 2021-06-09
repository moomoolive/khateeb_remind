import helpers from './helpers.js'
import store from '@/store/index.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

import axios from 'axios'

const extension = helpers.targetURL('user')

const requests = {
    async updateInfo(updates={}) {
        try {
            const res = await axios.put(extension + '/', updates)
            if (!res || !typeCheckingHelpers.isAnObject(res.data)) {
                return { data: null }
            }
            store.dispatch('user/updateUserInfo', res.data)
            return res
        } catch {
            return { data: null }
        }
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
        const toStore = { notifications: [], lastLogin: new Date() }
        try {
            const { data } = await axios.get(extension + '/notifications')
            if (!data || !Array.isArray(data.notifications) || !data.lastLogin) {
                throw TypeError(`recieved incorrect type from response`)
            }
            toStore.notifications = data.notifications
            toStore.lastLogin = data.lastLogin
        } catch {
            return { notifications: [], lastLogin: new Date() }
        }
        store.commit('notifications/stashServerNotifications', toStore.notifications)
        return store.commit('user/updateLastLogin', toStore.lastLogin)
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
    },
    async getScheduleRestrictions() {
        try {
            const { data: res } = await axios.get(extension + '/schedule-restrictions')
            if (!res || !Array.isArray(res.availableTimings) || !Array.isArray(res.unavailableDates)) {
                throw TypeError(`incorrect type recieved from response`)
            } else {
                return { 
                    unavailableDates: res.unavailableDates,
                    availableTimings: res.availableTimings 
                }
            }
        } catch {
            return { availableTimings: [], unavailableDates: [] }
        }
    },
    async updateScheduleRestrictions(info={}) {
        try {
            const { data: res } = await axios.put(extension + '/schedule-restrictions', info)
            if (!res || !Array.isArray(res.availableTimings) || !Array.isArray(res.unavailableDates)) {
                return null
            } else {
                return { 
                    unavailableDates: res.unavailableDates,
                    availableTimings: res.availableTimings 
                }
            }
        } catch {
            return null
        }
    }
}

export default requests

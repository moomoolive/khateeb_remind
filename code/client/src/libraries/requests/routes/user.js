import helpers from './helpers.js'
import store from '@/store/index.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

import axios from 'axios'

const extension = helpers.targetURL('user')

const requests = {
    async updateInfo(updates) {
        try {
            const res = await axios.put(extension + '/', updates)
            if (!res || !typeCheckingHelpers.isJWT(res.token))
                return { token: null }
            else
                return res
        } catch {
            return { token: null }
        }
    },
    async checkIn() {
        let userPackage = { 
            notifications: [],
            lastLogin: new Date(),
            institution: { name: "Error institution", abbreviatedName: "Error Inst" }
        }
        try {
            const res = await axios.get(extension + '/check-in')
            if (res && res.notifications && res.lastLogin && res.institution)
                userPackage = res
        } catch(err) {
            console.log(`Couldn't assign user package`)
        }
        store.dispatch('storeUserPackage', userPackage)
    },
    deleteAccount() {
        return axios.delete(extension + '/')
    },
    updateNotification(updatedNotification) {
        return axios.put(extension + '/notification', updatedNotification)
    }
}

export default requests

import helpers from './helpers.js'
import store from '@/store/index.js'

import axios from 'axios'

const extension = helpers.targetURL('user')

const requests = {
    updateInfo(updates) {
        return axios.put(extension + '/', updates)
    },
    async checkIn() {
        try {
            const userPackage = await axios.get(extension + '/check-in')
            store.dispatch('storeUserPackage', userPackage)
        } catch(err) {
            console.log(err)
            console.log(`Couldn't assign user package`)
        }
    },
    deleteAccount() {
        return axios.delete(extension + '/')
    },
    updateNotification(updatedNotification) {
        return axios.put(extension + '/notification', updatedNotification)
    }
}

export default requests

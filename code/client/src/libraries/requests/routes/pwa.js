import helpers from './helpers.js'
//import store from '@/store/index.js'

import axios from 'axios'

const extension = helpers.targetURL('user') + '/pwa-subscription'

const requests = {
    createPWASubscription(subscriptionInfo={}) {
        return axios.post(extension, subscriptionInfo)
    },
    deleteSubscription() {
        return helpers.returnEmptyObjectFromRequest('delete', ['user', '/pwa-subscription'])
    },
    getSubscriptions() {
        return helpers.returnArrayFromRequest('get', ['user', '/pwa-subscription'])
    }
}

export default requests
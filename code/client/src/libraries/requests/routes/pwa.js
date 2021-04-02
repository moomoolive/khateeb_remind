import helpers from './helpers.js'
//import store from '@/store/index.js'

import axios from 'axios'

const extension = helpers.targetURL('user') + '/pwa-subscription'

const requests = {
    createPWASubscription(subscriptionInfo={}) {
        return axios.post(extension, subscriptionInfo)
    },
    updateSubscriptionStatus(data={}) {
        return helpers.returnEmptyObjectFromRequest('put', ['user', '/pwa-subscription'], data)
    },
    getSubscriptions() {
        return helpers.returnArrayFromRequest('get', ['user', '/pwa-subscription'])
    }
}

export default requests
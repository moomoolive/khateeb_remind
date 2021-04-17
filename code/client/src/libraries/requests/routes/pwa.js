import helpers from './helpers.js'
import localStorageHelpers from '@/libraries/localStorageManagement/main.js'

import axios from 'axios'

const extension = helpers.targetURL('user') + '/pwa-subscription'

const requests = {
    async createPWASubscription(subscriptionInfo={}) {
        try {
            const res = await axios.post(extension, subscriptionInfo, { headers: { deviceid: localStorageHelpers.get("deviceId") } })
            if (!res || isNaN(res.code))
                return 1
            return res.code
        } catch {
            return 1
        }
    },
    updateSubscriptionStatus(data={}) {
        return helpers.returnEmptyObjectFromRequest('put', ['user', '/pwa-subscription'], data)
    },
    getSubscriptions() {
        return helpers.returnArrayFromRequest('get', ['user', '/pwa-subscription'])
    }
}

export default requests
import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('misc')

const requests = {
    async uniqueUsername(username) {
        try {
            const res = await axios.post(extension + '/unique-username', { username })
            return res
        } catch {
            return false
        }
    },
    institutionSelection() {
        return helpers.returnArrayFromRequest("get", ["misc", "institution-selection"])
    },
    async healthEndpoint() {
        try {
            const res = await axios.get(extension + '/health-endpoint')
            return res
        } catch {
            return 0
        }
    }
}

export default requests
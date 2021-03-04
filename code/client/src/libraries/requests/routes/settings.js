import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('settings')

const requests = {
    getSettings(params) {
        return axios.get(extension, { params })
    },
    updateSettings(updatedSettings) {
        return axios.put(extension, updatedSettings)
    }
}

export default requests
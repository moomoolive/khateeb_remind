import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('misc')

const requests = {
    uniqueUsername(username) {
        return axios.post(extension + '/unique-username', { username })
    },
    redirect(shortURLExtension) {
        return axios.get(extension + `/redirect/${shortURLExtension}`)
    },
    institutionSelection() {
        return axios.get(extension + "/institution-selection")
    }
}

export default requests
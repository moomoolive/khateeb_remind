import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('misc')

const requests = {
    uniqueUsername(username) {
        return axios.post(extension + '/unique-username', { username })
    },
    pendingKhateebCount() {
        return axios.get(extension + '/pending-khateebs')
    },
    redirect(shortURLExtension) {
        return axios.get(extension + `/redirect/${shortURLExtension}`)
    }
}

export default requests
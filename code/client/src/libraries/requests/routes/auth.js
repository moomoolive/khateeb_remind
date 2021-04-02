import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('auth')

const requests = {
    getToken(credentials) {
        return axios.post(extension + '/', credentials)
    },
    createInstitution(institutionAndAdminInfo={}) {
        return axios.post(extension + '/create/institution', institutionAndAdminInfo)
    },
    createKhateeb(khateebInfo={}) {
        return axios.post(extension + "/create/khateeb", khateebInfo)
    },
    sendVerificationCode(username={ username: "moomoo" }) {
        return axios.post(extension + '/forgot/password', username)
    },
    forgotUsername(phoneNumber={ phoneNumber: 100_000_0000 }) {
        return axios.post(extension + `/forgot/username`, phoneNumber)
    },
    verificationCodeCheck(passwordAndCode={}) {
        return axios.put(extension + '/verification-code', passwordAndCode)
    }
}

export default requests

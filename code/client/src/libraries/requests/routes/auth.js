import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('auth')

const requests = {
    getToken(credentials) {
        return axios.post(extension + '/', credentials)
    },
    createInstitution(institutionAndAdminInfo) {
        return axios.post(extension + '/create/institution', institutionAndAdminInfo)
    },
    getAvailableInstitutions() {
        return axios.get(extension + '/institution-selection')
    },
    createKhateeb(khateebInfo) {
        return axios.post(extension + "/create/khateeb", khateebInfo)
    },
    forgot(usernameOrPassword, data) {
        return axios.post(extension + `/forgot/${usernameOrPassword}`, data)
    },
    verificationCode(passwordAndCode) {
        return axios.post(extension + '/verification-code', passwordAndCode)
    }
}

export default requests

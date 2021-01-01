import axios from 'axios'

import API_URL from './consts.js'
const baseUrl = API_URL + '/misc'

export default {
    requestVerificationCode() {
        return axios.get(baseUrl + '/reset-pass')
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    sendVerificationCode(code) {
        return axios.post(baseUrl + '/verify-admin', code)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    checkTextService() {
        return axios.get(baseUrl + '/check-text-service')
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    checkValidCanadianAreaCode(code) {
        return axios.post(baseUrl + '/area-code', { code })
            .then(res => res.data !== 'exists' )
            .catch(err => { console.log(err) })
    }
}
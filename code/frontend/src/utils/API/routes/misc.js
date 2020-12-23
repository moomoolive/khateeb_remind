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
        return axios.post(baseUrl + '/verify-admin-text', { code })
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    savePassword(payload) {
        return axios.post(baseUrl + '/save-pass', payload)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    checkTextService() {
        axios.get(baseUrl + '/check-text-service')
            .then(res => { console.log(res) })
            .catch(err => { console.log(err) })
    },
    checkValidCanadianAreaCode(code) {
        return axios.post(baseUrl + '/area-code', { code })
            .then(res => res.data !== 'exists' )
            .catch(err => { console.log(err) })
    }
}
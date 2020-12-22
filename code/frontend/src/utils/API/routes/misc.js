import axios from 'axios'

import API_URL from './vars'

const baseUrl = API_URL + '/misc'

export default {
    async requestVerificationCode() {
        let responseData;
        await axios.get(baseUrl + '/reset-pass')
            .then((res) => {
                responseData = res.data
                console.log(res.data) 
            })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async sendVerificationCode(code) {
        let responseData
        await axios.post(baseUrl + '/verify-admin-text', { code })
            .then((res) => {
                responseData = res.data
                console.log(res.data)
            })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async savePassword(payload) {
        let responseData
        await axios.post(baseUrl + '/save-pass', payload)
            .then((res) => {
                console.log(res.data)
                responseData = res.data
            })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async checkTextService() {
        await axios.get(baseUrl + '/check-text-service')
            .then((res) => { console.log(res) })
            .catch((err) => { console.log(err) })
    },
    async checkValidCanadianAreaCode(code) {
        let response
        await axios.post(baseUrl + '/area-code', { code })
            .then((res) => { response = res.data !== 'exists' })
            .catch((err) => { console.log(err) })
        return response
    }
}
import axios from 'axios'

import API_URL from './consts.js'
const baseUrl = API_URL + '/initialize'

export default {
    initializePassword(payload) {
        return axios.post(baseUrl + '/password', payload)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    passwordExists() {
        return axios.get(baseUrl + '/pass-exists')
            .then(res => res.data)
            .catch(err => { console.log(err) })
    }
}
import axios from 'axios'

import API_URL from './consts.js'
const baseUrl = API_URL + '/general'

export default {
    monthlySchedule() {
        return axios.get(baseUrl  + '/')
            .then(res =>  res.data )
            .catch(err => { console.log(err) })
    },
    announcements() {
        return axios.get(baseUrl  + '/announcements')
            .then(res => res.data )
            .catch(err => { console.log(err) })
    },
    login(secretKey) {
        return axios.post(baseUrl  + '/authenicate', {key: secretKey})
            .then(res => res.data)
            .catch(err => { console.log(err) })
    }
}
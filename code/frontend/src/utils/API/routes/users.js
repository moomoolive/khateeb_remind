import axios from 'axios'

import API_URL from './vars'

const baseUrl = API_URL + '/general'

export default {
    async monthlySchedule() {
        let responseData
        await axios.get(baseUrl  + '/')
            .then((res) => { responseData = res.data })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async announcements() {
        let responseData
        await axios.get(baseUrl  + '/announcements')
            .then((res) => { responseData = res.data })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async login(secretKey) {
        let responseData
        const requestData = {key: secretKey}
        await axios.post(baseUrl  + '/authenicate', requestData)
            .then((res) => {
                responseData = res.data
            })
            .catch((err) => { console.log(err) })
        return responseData
    }
}
import axios from 'axios'

const apiCalls = {
    API_SERVER: process.env.VUE_APP_API_SERVER_URL || 'http://localhost:5000',
    async monthlySchedule() {
        let responseData
        await axios.post(this.API_SERVER + '/')
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async announcements() {
        let responseData
        await axios.post(this.API_SERVER + '/announcements')
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async login(secretKey) {
        let responseData
        const requestData = {key: secretKey}
        await axios.post(this.API_SERVER + '/authenicate', requestData)
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => { console.log(error) })
        return responseData
    }
}

export default apiCalls
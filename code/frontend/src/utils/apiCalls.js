import axios from 'axios'

export default {
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
    },
    async fetchMonthlySchedules(token, monthToQuery) {
        let responseData
        const requestData = {
            token,
            month: monthToQuery
        }
        await axios.post(this.API_SERVER + '/scheduler', requestData)
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async sendUpdatedSchedule(token, updatedSchedule, originalSchedule) {
        const requestData = {
            token,
            updatedSchedule,
            originalSchedule
        }
        await axios.post(this.API_SERVER + '/update-schedule', requestData)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async sendNewAnnouncement(token, payload) {
        const requestData = {
            token,
            payload
        }
        await axios.post(this.API_SERVER + '/new-announcement', requestData)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async getKhateebs(token) {
        let responseData
        await axios.post(this.API_SERVER + '/khateebs', { token })
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    }
}
import axios from 'axios'

export default {
    API_SERVER: process.env.VUE_APP_API_SERVER_URL || 'http://localhost:5000',
    generalRoutes: '/general',
    adminRoutes: '/admin',
    async monthlySchedule(date) {
        let responseData
        await axios.post(this.API_SERVER + this.generalRoutes + '/', { date })
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async announcements() {
        let responseData
        await axios.post(this.API_SERVER + this.generalRoutes + '/announcements')
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async login(secretKey) {
        let responseData
        const requestData = {key: secretKey}
        await axios.post(this.API_SERVER + this.generalRoutes + '/authenicate', requestData)
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
        await axios.post(this.API_SERVER + this.adminRoutes + '/scheduler', requestData)
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async sendUpdatedSchedule(token, payload) {
        const requestData = {
            token,
            payload
        }
        await axios.post(this.API_SERVER + this.adminRoutes + '/update-schedule', requestData)
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
        await axios.post(this.API_SERVER + this.adminRoutes + '/new-announcement', requestData)
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
        await axios.post(this.API_SERVER + this.adminRoutes + '/khateebs', { token })
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async updateKhateeb(token, khateebID, payload) {
        const requestData = {
            token,
            payload
        }
        await axios.post(this.API_SERVER + this.adminRoutes + '/update-khateeb/' + khateebID, requestData)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    }
}
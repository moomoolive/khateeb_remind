import axios from 'axios'

export default {
    API_SERVER: process.env.VUE_APP_API_SERVER_URL || 'http://localhost:5000',
    generalRoutes: '/general',
    adminRoutes: '/admin',
    async monthlySchedule() {
        let responseData
        await axios.get(this.API_SERVER + this.generalRoutes + '/')
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async announcements() {
        let responseData
        await axios.get(this.API_SERVER + this.generalRoutes + '/announcements')
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
        console.log(responseData)
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
    async getAnnouncements() {
        let responseData
        await axios.get(this.API_SERVER + this.adminRoutes + '/announcements')
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
            return responseData
    },
    async updateAnnouncements(payload) {
        await axios.post(this.API_SERVER + this.adminRoutes + '/announcements', payload)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async deleteAnnouncement(payload) {
        await axios.delete(this.API_SERVER + this.adminRoutes + '/announcements', { data: payload })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async getKhateebs() {
        let responseData
        await axios.get(this.API_SERVER + this.adminRoutes + '/khateebs')
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async updateKhateeb(payload) {
        console.log(payload)
        await axios.post(this.API_SERVER + this.adminRoutes + '/khateebs', payload)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async deleteKhateeb(ID) {
        let responseData
        await axios.delete(this.API_SERVER + this.adminRoutes + '/khateebs', { data: ID })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async updateLocationAndTiming(payload) {
        await axios.post(this.API_SERVER + this.adminRoutes + '/settings', payload)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async getLocationAndTiming(setting) {
        console.log(setting)
        let responseData
        await axios.get(this.API_SERVER + this.adminRoutes + `/settings/${setting}`)
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => {
                console.log(error)
            })
        return responseData
    },
    async initialTable(token, payload) {
        const requestData = {
            token,
            payload
        }
        let responseData
        await axios.post(this.API_SERVER + '/initialize' + '/location-timing', requestData)
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => {
                console.log(error)
            })
        return responseData
    },
}
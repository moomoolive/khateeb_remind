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
    async fetchMonthlySchedules(monthToQuery, fridayDates) {
        let responseData
        await axios.get(this.API_SERVER + this.adminRoutes + `/monthlySchedules/${monthToQuery}/${fridayDates}`)
            .then((response) => { responseData = response.data })
            .catch((error) => { console.log(error) })
        return responseData
    },
    async sendUpdatedSchedule(payload) {
        await axios.post(this.API_SERVER + this.adminRoutes + '/monthlySchedules', payload)
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
    async getKhateebs(fullOrNot) {
        let responseData
        await axios.get(this.API_SERVER + this.adminRoutes + '/khateebs/' + fullOrNot)
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
    }
}
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
    async getAnnouncements(token, payload) {
        const requestData = {
            token,
            payload
        }
        let responseData
        await axios.post(this.API_SERVER + this.adminRoutes + '/announcements', requestData)
            .then((response) => {
                responseData = response.data
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
            return responseData
    },
    async updateAnnouncements(token, payload) {
        const requestData = {
            token,
            payload
        }
        await axios.post(this.API_SERVER + this.adminRoutes + '/announcements', requestData)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async getKhateebs(token) {
        const requestData = {
            token,
            payload: {
                action: 'get' 
            }
        }
        let responseData
        await axios.post(this.API_SERVER + this.adminRoutes + '/update-khateeb/' + '__GET__', requestData)
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
    },
    async saveLocationAndTiming(token, payload, version, id=null) {
        const requestData = {
            token,
            payload,
            __v: version,
            _id: id
        }
        await axios.post(this.API_SERVER + this.adminRoutes + '/locations-timing', requestData)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                window.alert('There was a problem saving your changes')
            })
    },
    async getLocationAndTiming(token) {
        let responseData
        await axios.post(this.API_SERVER + this.adminRoutes + '/locations-timing-info', { token })
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
import axios from 'axios'

import API_URL from './vars'

const baseUrl = API_URL + '/admin'

export default {
    async fetchMonthlySchedules(monthToQuery, fridayDates) {
        let responseData
        await axios.get(baseUrl + `/monthlySchedules/${monthToQuery}/${fridayDates}`)
            .then((res) => { responseData = res.data })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async sendUpdatedSchedule(payload) {
        await axios.post(baseUrl + '/monthlySchedules', payload)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
    },
    async getAnnouncements() {
        let responseData
        await axios.get(baseUrl + '/announcements')
            .then((res) => {
                responseData = res.data
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
            return responseData
    },
    async updateAnnouncement(payload) {
        await axios.post(baseUrl + '/announcements', payload)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
    },
    async deleteAnnouncement(payload) {
        await axios.delete(baseUrl + '/announcements', { data: payload })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
    },
    async getKhateebs(fullOrNot) {
        let responseData
        await axios.get(baseUrl + '/khateebs/' + fullOrNot)
            .then((res) => { responseData = res.data })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async updateKhateeb(payload) {
        console.log(payload)
        await axios.post(baseUrl + '/khateebs', payload)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
    },
    async deleteKhateeb(ID) {
        let responseData
        await axios.delete(baseUrl + '/khateebs', { data: ID })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
    },
    async updateSetting(payload) {
        await axios.post(baseUrl + '/settings', payload)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                window.alert('There was a problem saving your changes')
            })
    },
    async getSetting(setting) {
        console.log(setting)
        let responseData
        await axios.get(baseUrl + `/settings/${setting}`)
            .then((res) => {
                responseData = res.data
            })
            .catch((err) => {
                console.log(err)
            })
        return responseData
    }
}
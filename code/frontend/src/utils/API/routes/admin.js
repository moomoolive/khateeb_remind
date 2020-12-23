import axios from 'axios'

import API_URL from './consts.js'
const baseUrl = API_URL + '/admin'

const funcs = {
    failedUpdate(error) {
        console.log(error)
        window.alert('There was a problem saving your changes')
    }
}

export default {
    getMonthlySchedule(monthToQuery, fridayDates) {
        return axios.get(baseUrl + `/monthlySchedules/${monthToQuery}/${fridayDates}`)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    updatedSchedule(payload) {
        axios.post(baseUrl + '/monthlySchedules', payload)
            .then(res => { console.log(res) })
            .catch(funcs.failedUpdate)
    },
    getAnnouncements() {
        return axios.get(baseUrl + '/announcements')
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    updateAnnouncement(payload) {
        axios.post(baseUrl + '/announcements', payload)
            .then(res => { console.log(res) })
            .catch(funcs.failedUpdate)
    },
    deleteAnnouncement(payload) {
        axios.delete(baseUrl + '/announcements', { data: payload })
            .then(res => { console.log(res) })
            .catch(funcs.failedUpdate)
    },
    getKhateebs(fullOrNot) {
        return axios.get(baseUrl + '/khateebs/' + fullOrNot)
            .then(res => res.data )
            .catch(err => { console.log(err) })
    },
    updateKhateeb(payload) {
        axios.post(baseUrl + '/khateebs', payload)
            .then(res => { console.log(res) })
            .catch(funcs.failedUpdate)
    },
    deleteKhateeb(ID) {
        axios.delete(baseUrl + '/khateebs', { data: ID })
            .then(res => { console.log(res) })
            .catch(funcs.failedUpdate)
    },
    getSetting(setting) {
        return axios.get(baseUrl + `/settings/${setting}`)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    updateSetting(payload) {
        axios.post(baseUrl + '/settings', payload)
            .then(res => { console.log(res) })
            .catch(funcs.failedUpdate)
    }
}
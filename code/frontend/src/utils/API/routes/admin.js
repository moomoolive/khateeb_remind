import axios from 'axios'

import API_URL from './consts.js'
const baseUrl = API_URL + '/admin'

const funcs = {
    failedUpdate(error) {
        console.log(error)
        window.alert('There was a problem saving your changes')
    },
    successfulUpdate(response) {
        console.log(response)
        return response.data
    }
}

export default {
    getMonthlySchedule(monthToQuery, fridayDates) {
        return axios.get(baseUrl + `/monthlySchedules/${monthToQuery}/${fridayDates}`)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    updatedSchedule(payload) {
        return axios.post(baseUrl + '/monthlySchedules', payload)
            .then(funcs.successfulUpdate)
            .catch(funcs.failedUpdate)
    },
    getAnnouncements() {
        return axios.get(baseUrl + '/announcements')
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    updateAnnouncement(payload) {
        return axios.post(baseUrl + '/announcements', payload)
            .then(funcs.successfulUpdate)
            .catch(funcs.failedUpdate)
    },
    deleteAnnouncement(payload) {
        return axios.delete(baseUrl + '/announcements', { data: payload })
            .then(funcs.successfulUpdate)
            .catch(funcs.failedUpdate)
    },
    getKhateebs(fullOrNot) {
        return axios.get(baseUrl + '/khateebs/' + fullOrNot)
            .then(res => res.data )
            .catch(err => { console.log(err) })
    },
    updateKhateeb(payload) {
        return axios.post(baseUrl + '/khateebs', payload)
            .then(funcs.successfulUpdate)
            .catch(funcs.failedUpdate)
    },
    deleteKhateeb(ID) {
        return axios.delete(baseUrl + '/khateebs', { data: ID })
            .then(funcs.successfulUpdate)
            .catch(funcs.failedUpdate)
    },
    getSetting(setting) {
        return axios.get(baseUrl + `/settings/${setting}`)
            .then(res => res.data)
            .catch(err => { console.log(err) })
    },
    updateSetting(payload) {
        return axios.post(baseUrl + '/settings', payload)
            .then(funcs.successfulUpdate)
            .catch(funcs.failedUpdate)
    }
}
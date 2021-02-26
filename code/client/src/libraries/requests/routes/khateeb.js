import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('khateeb')

const requests = {
    getAnnouncements() {
        return axios.get(extension + '/announcements')
    },
    getCurrentSchedule() {
        return axios.get(extension + '/')
    },
    confirmJummahPackage(jummahID, notificationID) {
        return axios.get(extension + `/jummah-confirm/${jummahID}/${notificationID}`)
    },
    confirmJummah(confirmedPackage) {
        return axios.post(extension + '/jummah-confirm', confirmedPackage)
    },
    getAvailableTimings() {
        return axios.get(extension + '/available-timings')
    }
}

export default requests
import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('institutionAdmin')

const requests = {
    getAnnouncements() {
        return axios.get(extension + '/announcements')
    },
    updateAnnouncements(announcement) {
        return axios.post(extension + '/announcements', announcement)
    },
    deleteAnnouncement(id) {
        return axios.delete(extension + `/announcements/${id}`)
    },
    getLocations(location) {
        return axios.get(extension + `/locations/${location}`)
    },
    saveLocations(locationsArray) {
        return axios.post(extension + '/locations', locationsArray)
    },
    deleteLocation(id) {
        return axios.delete(extension + `/locations/${id}`)
    },
    getTimings(timing, associatedLocation) {
        return axios.get(extension + `/timings/${timing}/${associatedLocation}`)
    },
    saveTimings(timingsArray) {
        return axios.post(extension + '/timings', timingsArray)
    },
    deleteTiming(id) {
        return axios.delete(extension + `/timings/${id}`)
    },
    getSettings() {
        return axios.get(extension + '/settings')
    },
    updateSettings(settings) {
        return axios.put(extension + '/settings', settings)
    },
    getSchedule(month, year) {
        return axios.get(extension + `/schedules/${month}/${year}`)
    },
    saveJummahs(jummahsArray) {
        return axios.put(extension + '/jummahs', jummahsArray)
    },
    getKhateebs() {
        return axios.get(extension + '/khateebs')
    },
    updateExistingKhateeb(updatedKhateebInfo) {
        return axios.put(extension + '/khateebs', updatedKhateebInfo)
    },
    deleteKhateeb(id) {
        return axios.delete(extension + `/khateebs/${id}`)
    },
    getInstitution() {
        return axios.get(extension + '/institution')
    },
    updateInstitution(updatedInstitution) {
        return axios.put(extension + '/institution', updatedInstitution)
    },
    sendNotifications() {
        return axios.get(extension + '/send-notifications')
    },
    clearJummah(clearedJummah) {
        return axios.put(extension + '/clear-jummah', clearedJummah)
    }
}

export default requests
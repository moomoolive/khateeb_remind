import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('announcements')

const requests = {
    getAnnouncements(params) {
        return axios.get(extension, { params })
    },
    createNewAnnouncement(newAnnouncement) {
        return axios.post(extension, newAnnouncement)
    },
    updateAnnouncement(updatedAnnouncement) {
        return axios.put(extension, updatedAnnouncement)
    },
    deleteAnnouncement(_id) {
        return axios.delete(extension, { params: { _id } })
    }
}

export default requests
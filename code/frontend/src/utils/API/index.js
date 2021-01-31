import store from '@/store/index.js'

import axios from 'axios'

const API_URL = process.env.VUE_APP_API_SERVER_URL || 'http://localhost:80'

const nonErrorResponse = res => res.data
const errorResponse = err => {
    const errOrigin = err.response.request.responseURL
    const splitOrigin = errOrigin.split('/')
    if (!err.response) {
        store.dispatch('createNotification', { type: 'alert', options: { template: 'serverError' } })
        return Promise.reject(err)
    }
    const fromCheckin = splitOrigin[3] === 'user' && splitOrigin[4] === 'check-in'
    if (fromCheckin) {
        return Promise.reject(err)
    }
    else if (err.response.status === 401) {
        const fromLogin = splitOrigin[3] === 'auth' && splitOrigin[4] === ''
        if (fromLogin)
            return Promise.reject(err.response)
        else {
            store.dispatch('createNotification', { type: 'alert', options: { template: 'unauthorized' } })
            return Promise.reject(err)
        }
    }
    else {
        store.dispatch('createNotification', { type: 'alert', options: { template: 'serverError' } })
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(nonErrorResponse, errorResponse)

const authExt = API_URL + '/auth'
const auth = {
    getToken(credentials) {
        return axios.post(authExt + '/', credentials)
    },
    createInstitution(institutionAndAdminInfo) {
        return axios.post(authExt + '/create/institution', institutionAndAdminInfo)
    },
    createRoot(rootInfo) {
        return axios.post(authExt + '/create/root', rootInfo)
    },
    getAvailableInstitutions() {
        return axios.get(authExt + '/institution-selection')
    },
    createKhateeb(khateebInfo) {
        return axios.post(authExt + "/create/khateeb", khateebInfo)
    }
}

const khateebExt = API_URL + '/khateeb'
const khateeb = {
    getAnnouncements() {
        return axios.get(khateebExt + '/announcements')
    },
    getCurrentSchedule() {
        return axios.get(khateebExt + '/')
    }
} 

const sysAdminExt = API_URL + '/sysAdmin'
const sysAdmin = {
    executeCommand(commandArray) {
        return axios.post(sysAdminExt + '/cli', commandArray)
    }
}

const institutionAdminExt = API_URL + '/institutionAdmin'
const institutionAdmin = {
    getAnnouncements() {
        return axios.get(institutionAdminExt + '/announcements')
    },
    updateAnnouncements(announcement) {
        return axios.post(institutionAdminExt + '/announcements', announcement)
    },
    deleteAnnouncement(id) {
        return axios.delete(institutionAdminExt + '/announcements', { data: id })
    },
    getLocations(location) {
        return axios.get(institutionAdminExt + `/locations/${location}`)
    },
    saveLocations(locationsArray) {
        return axios.post(institutionAdminExt + '/locations', locationsArray)
    },
    deleteLocation(id) {
        return axios.delete(institutionAdminExt + '/locations', { data: id })
    },
    getTimings(timing, associatedLocation) {
        return axios.get(institutionAdminExt + `/timings/${timing}/${associatedLocation}`)
    },
    saveTimings(timingsArray) {
        return axios.post(institutionAdminExt + '/timings', timingsArray)
    },
    deleteTiming(id) {
        return axios.delete(institutionAdminExt + '/timings', { data: id })
    },
    getSettings() {
        return axios.get(institutionAdminExt + '/settings')
    },
    updateSettings(settings) {
        return axios.post(institutionAdminExt + '/settings', settings)
    },
    getSchedule(month, year) {
        return axios.get(institutionAdminExt + `/schedules/${month}/${year}`)
    },
    saveJummahs(jummahsArray) {
        return axios.post(institutionAdminExt + '/jummahs', jummahsArray)
    },
    getKhateebs() {
        return axios.get(institutionAdminExt + '/khateebs')
    },
    updateExistingKhateeb(updatedKhateebInfo) {
        return axios.post(institutionAdminExt + '/khateebs', updatedKhateebInfo)
    },
    deleteKhateeb(id) {
        return axios.delete(institutionAdminExt + '/khateebs', { data: id })
    },
    confirmKhateeb(id) {
        return axios.post(institutionAdminExt + '/khateebs/confirm', id)
    },
    getInstitution() {
        return axios.get(institutionAdminExt + '/institution')
    },
    updateInstitution(updatedInstitution) {
        return axios.post(institutionAdminExt + '/institution', updatedInstitution)
    }
}

const userExt = API_URL + `/user`
const user = {
    changePassword(newPassword) {
        return axios.post(userExt + '/password', newPassword)
    },
    changeUsername(newUsername) {
        return axios.post(userExt + '/username', newUsername)
    },
    changeProfile(updatedProfile) {
        return axios.post(userExt + '/profile', updatedProfile)
    },
    checkIn() {
        return axios.get(userExt + '/check-in')
    }
}

const miscExt = API_URL + '/misc'
const misc = {
    uniqueUsername(username) {
        return axios.post(miscExt + '/unique-username', { username })
    }
}


export default {
    auth,
    sysAdmin,
    khateeb,
    institutionAdmin,
    user,
    misc
}
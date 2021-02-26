import store from '@/store/index.js'

import axios from 'axios'

const API_URL = process.env.VUE_APP_API_SERVER_URL || 'http://localhost:80'

const serverErrorTag = {
    "color": "yellow",
    "icon": "unknown",
    "msg": "Our servers aren't responding right now. Try again later!",
    "textSize": "small"
}

const nonErrorResponse = res => res.data
const errorResponse = err => {
    const errOrigin = err.response.request.responseURL
    const splitOrigin = errOrigin.split('/')
    if (!err.response) {
        store.dispatch('notifications/create', { type: 'alert', options: serverErrorTag })
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
            const options = {
                color: "red",
                icon: "locked",
                msg: "Unauthorized"
            }
            store.dispatch('notifications/create', { type: 'alert', options })
            return Promise.reject(err)
        }
    }
    else {
        store.dispatch('notifications/create', { type: 'alert', options: serverErrorTag })
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
    getAvailableInstitutions() {
        return axios.get(authExt + '/institution-selection')
    },
    createKhateeb(khateebInfo) {
        return axios.post(authExt + "/create/khateeb", khateebInfo)
    },
    forgot(usernameOrPassword, data) {
        return axios.post(authExt + `/forgot/${usernameOrPassword}`, data)
    },
    verificationCode(passwordAndCode) {
        return axios.post(authExt + '/verification-code', passwordAndCode)
    }
}

const khateebExt = API_URL + '/khateeb'
const khateeb = {
    getAnnouncements() {
        return axios.get(khateebExt + '/announcements')
    },
    getCurrentSchedule() {
        return axios.get(khateebExt + '/')
    },
    confirmJummahPackage(jummahID, notificationID) {
        return axios.get(khateebExt + `/jummah-confirm/${jummahID}/${notificationID}`)
    },
    confirmJummah(confirmedPackage) {
        return axios.post(khateebExt + '/jummah-confirm', confirmedPackage)
    },
    getAvailableTimings() {
        return axios.get(khateebExt + '/available-timings')
    }
} 

const sysAdminExt = API_URL + '/sysAdmin'
const sysAdmin = {
    executeCommand(commandArray) {
        return axios.post(sysAdminExt + '/cli', commandArray)
    }
}

const rootInstitutionAdminExt = API_URL + '/rootInstitutionAdmin'
const rootInstitutionAdmin = {
    getOtherAdmins() {
        return axios.get(rootInstitutionAdminExt + '/institutionAdmin')
    },
    updateAdmin(updatedAdmin) {
        return axios.post(rootInstitutionAdminExt + '/institutionAdmin', updatedAdmin)
    },
    deleteAdmin(adminId) {
        return axios.delete(rootInstitutionAdminExt + `/institutionAdmin/${adminId}`)
    },
    deleteInstitution() {
        return axios.delete(rootInstitutionAdminExt + '/institution')
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
        return axios.delete(institutionAdminExt + `/announcements/${id}`)
    },
    getLocations(location) {
        return axios.get(institutionAdminExt + `/locations/${location}`)
    },
    saveLocations(locationsArray) {
        return axios.post(institutionAdminExt + '/locations', locationsArray)
    },
    deleteLocation(id) {
        return axios.delete(institutionAdminExt + `/locations/${id}`)
    },
    getTimings(timing, associatedLocation) {
        return axios.get(institutionAdminExt + `/timings/${timing}/${associatedLocation}`)
    },
    saveTimings(timingsArray) {
        return axios.post(institutionAdminExt + '/timings', timingsArray)
    },
    deleteTiming(id) {
        return axios.delete(institutionAdminExt + `/timings/${id}`)
    },
    getSettings() {
        return axios.get(institutionAdminExt + '/settings')
    },
    updateSettings(settings) {
        return axios.put(institutionAdminExt + '/settings', settings)
    },
    getSchedule(month, year) {
        return axios.get(institutionAdminExt + `/schedules/${month}/${year}`)
    },
    saveJummahs(jummahsArray) {
        return axios.put(institutionAdminExt + '/jummahs', jummahsArray)
    },
    getKhateebs() {
        return axios.get(institutionAdminExt + '/khateebs')
    },
    updateExistingKhateeb(updatedKhateebInfo) {
        return axios.put(institutionAdminExt + '/khateebs', updatedKhateebInfo)
    },
    deleteKhateeb(id) {
        return axios.delete(institutionAdminExt + `/khateebs/${id}`)
    },
    getInstitution() {
        return axios.get(institutionAdminExt + '/institution')
    },
    updateInstitution(updatedInstitution) {
        return axios.put(institutionAdminExt + '/institution', updatedInstitution)
    },
    sendNotifications() {
        return axios.get(institutionAdminExt + '/send-notifications')
    },
    clearJummah(clearedJummah) {
        return axios.put(institutionAdminExt + '/clear-jummah', clearedJummah)
    }
}

const userExt = API_URL + `/user`
const user = {
    updateInfo(updates) {
        return axios.put(userExt + '/', updates)
    },
    async checkIn() {
        try {
            const userPackage = await axios.get(userExt + '/check-in')
            store.dispatch('storeUserPackage', userPackage)
        } catch(err) {
            console.log(err)
            console.log(`Couldn't assign user package`)
        }
    },
    deleteAccount() {
        return axios.delete(userExt + '/')
    },
    updateNotification(updatedNotification) {
        return axios.put(userExt + '/notification', updatedNotification)
    }
}

const miscExt = API_URL + '/misc'
const misc = {
    uniqueUsername(username) {
        return axios.post(miscExt + '/unique-username', { username })
    },
    pendingKhateebCount() {
        return axios.get(miscExt + '/pending-khateebs')
    },
    redirect(shortURLExtension) {
        return axios.get(miscExt + `/redirect/${shortURLExtension}`)
    }
}

export default {
    auth,
    sysAdmin,
    khateeb,
    institutionAdmin,
    user,
    misc,
    rootInstitutionAdmin
}
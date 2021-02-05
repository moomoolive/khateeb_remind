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
        store.dispatch('createNotification', { type: 'alert', options: serverErrorTag })
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
            store.dispatch('createNotification', { type: 'alert', options })
            return Promise.reject(err)
        }
    }
    else {
        store.dispatch('createNotification', { type: 'alert', options: serverErrorTag })
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
        return axios.delete(rootInstitutionAdminExt + '/institutionAdmin', { data: adminId })
    },
    deleteInstitution(rootAdminId) {
        return axios.delete(rootInstitutionAdminExt + '/delete-institution', { data: rootAdminId })
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
    },
    markNotificationAsSeen(notificationId) {
        return axios.post(userExt + '/mark-notification-as-seen', notificationId)
    },
    deleteAccount() {
        return axios.delete(userExt + '/account', { data: { _id: 'myAccount' } })
    }
}

const miscExt = API_URL + '/misc'
const misc = {
    uniqueUsername(username) {
        return axios.post(miscExt + '/unique-username', { username })
    },
    pendingKhateebCount() {
        return axios.get(miscExt + '/pending-khateebs')
    }
}

const utils = {
    assignUserPackage(userPkg) {
        store.dispatch('storeNotificationsFromAPI', userPkg)
        const urgentNotifications = userPkg.filter(note => !note.seen)
        urgentNotifications.forEach(note => {
            const notification = this.prepNotification(note)
            store.dispatch('createNotification', notification)
        })
    },
    prepNotification(notification) {
        const options = {
            textSize: 'small',
            icon: 'asalam',
            msg: notification.msg,
            _id: notification._id,
            notificationOrigin: 'server',
            color: 'green'
        }
        let type = 'alert'
        switch(notification.tag) {
            case 'welcome':
                options.icon = 'asalam'
                options.graphicType = 'gif'
                break
            case 'khateebs':
                options.icon = 'khateebs'
                if (notification.meta.dropout)
                    options.color = 'yellow'
                break
            case 'jummah':
                type = 'redirect'
                options.redirections = [
                    {
                        to: notification.actionLink,
                        text: 'confirm'
                    }
                ]
                break
        }
        return { type, options }
    }
}

export default {
    auth,
    sysAdmin,
    khateeb,
    institutionAdmin,
    user,
    misc,
    rootInstitutionAdmin,
    utils
}
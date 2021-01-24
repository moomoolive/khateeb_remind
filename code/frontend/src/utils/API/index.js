import misc from './routes/misc.js'
import users from './routes/users.js'
import admin from './routes/admin.js'
import store from '@/store/index.js'

import axios from 'axios'

const API_URL = process.env.VUE_APP_API_SERVER_URL || 'http://localhost:80'

const nonErrorResponse = res => res.data
const errorResponse = err => {
    if (err.response.status === 401) {
        const errOrigin = err.response.request.responseURL
        const splitOrigin = errOrigin.split('/')
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
    }
} 

const rootExt = API_URL + '/root'
const root = {
    executeCommand(commandArray) {
        return axios.post(rootExt + '/cli', commandArray)
    }
}

export default {
    misc,
    users,
    admin,
    auth,
    root,
    khateeb
}
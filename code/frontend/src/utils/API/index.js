import misc from './routes/misc.js'
import users from './routes/users.js'
import admin from './routes/admin.js'

import axios from 'axios'

const API_URL = process.env.VUE_APP_API_SERVER_URL || 'http://localhost:80'

const nonErrorResponse = res => res.data
const errorResponse = err => {
    console.log(err)
    if (err.response.status === 401) {
        alert('Unauthorized')
        return Promise.reject(err)
    }
    if (err.response.status === 500) {
        alert('There seems to be an issue with our server. Try again later.')
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(nonErrorResponse, errorResponse)

const authExt = API_URL + '/auth'
const auth = {
    getToken(credentials) {
        return axios.post(authExt + '/', credentials)
    }
}

export default {
    misc,
    users,
    admin,
    auth
}
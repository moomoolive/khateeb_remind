import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('institutionAdmins')

const requests = {
    getOtherAdmins(params) {
        return axios.get(extension, { params })
    },
    createNewAdmin(updatedAdmin) {
        return axios.post(extension, updatedAdmin)
    },
    deleteAdmin(_id) {
        return axios.delete(extension, { params: { _id } })
    }
}

export default requests
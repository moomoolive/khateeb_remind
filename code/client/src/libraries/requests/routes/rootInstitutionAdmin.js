import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('rootInstitutionAdmin')

const requests = {
    getOtherAdmins() {
        return axios.get(extension + '/institutionAdmin')
    },
    updateAdmin(updatedAdmin) {
        return axios.post(extension + '/institutionAdmin', updatedAdmin)
    },
    deleteAdmin(adminId) {
        return axios.delete(extension + `/institutionAdmin/${adminId}`)
    },
    deleteInstitution() {
        return axios.delete(extension + '/institution')
    }
}

export default requests
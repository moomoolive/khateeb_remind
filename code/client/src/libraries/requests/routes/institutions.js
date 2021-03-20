import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('institutions')

const requests = {
    getInstitution(params) {
        return axios.get(extension, { params })
    },
    updateInstitution(updatedInstitution) {
        return axios.put(extension, updatedInstitution)
    },
    deleteInstitution() {
        return axios.delete(extension)
    }
}

export default requests
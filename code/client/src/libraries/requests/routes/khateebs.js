import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('khateebs')

const requests = {
    getKhateebs(params) {
        return axios.get(extension, { params })
    },
    updateExistingKhateeb(updatedKhateeb) {
        return axios.put(extension, updatedKhateeb)
    }, 
    deleteKhateeb(_id) {
        return axios.delete(extension, { params: { _id } })
    }
}

export default requests
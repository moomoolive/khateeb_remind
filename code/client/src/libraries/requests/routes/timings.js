import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('timings')

const requests = {
    getTimings(params) {
        return axios.get(extension, { params })
    },
    createNewTiming(newTiming) {
        return axios.post(extension, newTiming)
    },
    updateTiming(updatedTiming) {
        return axios.put(extension, updatedTiming)
    },
    deleteTiming(_id) {
        return axios.delete(extension, { params: { _id } })
    }
}

export default requests
import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('jummahs')

const requests = {
    getJummahs(params) {
        return axios.get(extension, { params })
    },
    createNewPreference(newPreference) {
        return axios.post(extension, newPreference)
    },
    updateJummahPreference(updatedJummah={}) {
        if (updatedJummah._id === undefined)
            throw TypeError(`You must provide a valid id to update jummah`)
        return axios.put(extension, updatedJummah)
    },
    runNotificationLoop(jummah={}, backup=false) {
        return axios.put(extension + `/run-loop/${backup}`, jummah)
    }
}

export default requests
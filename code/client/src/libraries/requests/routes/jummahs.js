import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('jummahs')

const requests = {
    getJummahs(params) {
        return axios.get(extension, { params })
    },
    createNewJummahs(newJummahs=[]) {
        if (!Array.isArray(newJummahs))
            throw TypeError(`New jummahs must be in array format`)
        return axios.post(extension, { jummahs: newJummahs })
    },
    updateJummah(updatedJummah={}) {
        if (updatedJummah._id === undefined)
            throw TypeError(`You must provide a valid id to update jummah`)
        return axios.put(extension, updatedJummah)
    }
}

export default requests
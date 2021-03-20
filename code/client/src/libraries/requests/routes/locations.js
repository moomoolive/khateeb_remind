import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('locations')

const requests = {
    getLocations(params) {
        return axios.get(extension, { params })
    },
    createNewLocation(newLocation) {
        return axios.post(extension, newLocation)
    },
    deleteLocation(_id) {
        return axios.delete(extension, { params: { _id } })
    },
    updateLocation(updatedLocation) {
        return axios.put(extension, updatedLocation)
    }
}

export default requests
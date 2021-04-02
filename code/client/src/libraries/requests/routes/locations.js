import helpers from './helpers.js'

const extension = 'locations'

const requests = {
    getLocations(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    createNewLocation(newLocation={}) {
        return helpers.returnCustomObjectFromRequest({ location: {}, timing: {} })("post", extension, newLocation)
    },
    deleteLocation(_id="1234") {
        return helpers.returnEmptyObjectFromRequest("delete", extension, { params: { _id } })
    },
    updateLocation(updatedLocation={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedLocation)
    }
}

export default requests
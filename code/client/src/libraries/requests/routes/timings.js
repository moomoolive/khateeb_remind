import helpers from './helpers.js'

const extension = "timings"

const requests = {
    getTimings(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    createNewTiming(newTiming={}) {
        return helpers.returnEmptyObjectFromRequest("post", extension, newTiming)
    },
    updateTiming(updatedTiming={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedTiming)
    },
    deleteTiming(_id="1234") {
        return helpers.returnEmptyObjectFromRequest("delete", extension, { params: { _id } })
    }
}

export default requests
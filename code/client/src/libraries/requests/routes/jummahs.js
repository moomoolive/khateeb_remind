import helpers from './helpers.js'

const extension = "jummahs"

const requests = {
    getJummahs(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    createNewJummahPreference(newPreference={}) {
        return helpers.returnEmptyObjectFromRequest("post", extension, newPreference)
    },
    updateJummahPreference(updatedJummah={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedJummah)
    },
    runNotificationLoop(jummah={}, backup=false) {
        return helpers.returnCustomObjectFromRequest({ targetPreference: {}, otherPreference: {} })("put", [extension, 'run-loop'], jummah, { params: { backup } })
    }
}

export default requests
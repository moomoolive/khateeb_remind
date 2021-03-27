import helpers from './helpers.js'

const extension = "jummahs"

const requests = {
    getJummahs(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    createNewPreference(newPreference={}) {
        return helpers.returnEmptyObjectFromRequest("post", extension, newPreference)
    },
    updateJummahPreference(updatedJummah={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedJummah)
    },
    runNotificationLoop(jummah={}, backup=false) {
        return helpers.returnCustomObjectFromRequest({ targetPreference: {}, otherPreference: {} })("put", extension, jummah, { params: { backup } })
    }
}

export default requests
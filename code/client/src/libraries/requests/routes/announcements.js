import helpers from './helpers.js'

const extension = "announcements"

const requests = {
    getAnnouncements(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    createNewAnnouncement(newAnnouncement={}) {
        return helpers.returnEmptyObjectFromRequest("post", extension, newAnnouncement)
    },
    updateAnnouncement(updatedAnnouncement={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedAnnouncement)
    },
    deleteAnnouncement(_id="1234") {
        return helpers.returnEmptyObjectFromRequest("delete", extension, { params: { _id } })
    }
}

export default requests
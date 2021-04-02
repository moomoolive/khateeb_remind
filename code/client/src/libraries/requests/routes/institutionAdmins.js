import helpers from './helpers.js'

const extension = "institutionAdmins"

const requests = {
    getOtherAdmins(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    createNewAdmin(newAdmin={}) {
        return helpers.returnEmptyObjectFromRequest("post", extension, newAdmin)
    },
    deleteAdmin(_id="1234") {
        return helpers.returnEmptyObjectFromRequest("delete", extension, { params: { _id } })
    }
}

export default requests
import helpers from './helpers.js'

const extension = "institutionAdmins"

const requests = {
    getOtherAdmins(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    confirmAdmin(info={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, info)
    },
    deleteAdmin(params={}) {
        return helpers.returnEmptyObjectFromRequest("delete", extension, { params })
    }
}

export default requests
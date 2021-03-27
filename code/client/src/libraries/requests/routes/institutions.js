import helpers from './helpers.js'

const extension = "institutions"

const requests = {
    getInstitution(params={}) {
        return helpers.returnEmptyObjectFromRequest("get", extension, { params })
    },
    updateInstitution(updatedInstitution={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedInstitution)
    },
    deleteInstitution() {
        return helpers.returnEmptyObjectFromRequest("delete", extension)
    }
}

export default requests
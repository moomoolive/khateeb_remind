import helpers from './helpers.js'

const extension = "khateebs"

const requests = {
    getKhateebs(params={}) {
        return helpers.returnArrayFromRequest("get", extension, { params })
    },
    updateExistingKhateeb(updatedKhateeb={}) {
        return helpers.returnEmptyObjectFromRequest("put", extension, updatedKhateeb)
    }, 
    deleteKhateeb(_id="1234") {
        return helpers.returnEmptyObjectFromRequest("delete", extension, { params: { _id } })
    }
}

export default requests
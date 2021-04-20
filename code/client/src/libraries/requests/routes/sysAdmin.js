import helpers from './helpers.js'

const requests = {
    getInstitutions(params={}) {
        return helpers.returnArrayFromRequest('get', ['sysAdmin', 'institutions'], { params })
    },
    updateInstitution(info={}) {
        return helpers.returnEmptyObjectFromRequest('put', ['sysAdmin', 'institutions'], info)
    }
}

export default requests
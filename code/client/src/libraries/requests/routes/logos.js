import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('logos')

const genericInstitutionLogo = require('@/assets/logos/genericInstitution.png')

const requests = {
    async getInstitutionLogo(params={}) {
        try {
            const res = await axios.get(extension, { responseType: 'blob', params })
            if (!res || !/image/g.test(res.type))
                return genericInstitutionLogo
            return window.URL.createObjectURL(res)
        } catch {
            return genericInstitutionLogo
        }
    },
    async saveInstitutionLogo(ObjectWithBase64={}) {
        try {
            const { data={ code: 0 } } = await axios.put(extension, ObjectWithBase64)
            return data.code
        } catch {
            return 1
        }
    },
    async deleteInstitutionLogo() {
        try {
            const { data={ code: 0 } } = await axios.delete(extension)
            return data.code
        } catch {
            return 1
        }
    }
}

export default requests
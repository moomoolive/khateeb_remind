import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('logos')

const genericInstitutionLogo = require('@/assets/logos/genericInstitution.png')

const requests = {
    async getInstitutionLogo(params={}) {
        try {
            const res = await axios.get(extension, { responseType: "blob", params })
            return window.URL.createObjectURL(res)
        } catch(err) {
            return genericInstitutionLogo
        }
    },
    async saveInstitutionLogo(ObjectWithBase64={}) {
        try {
            const res = await axios.put(extension, ObjectWithBase64)
            return res
        } catch(err) {
            return { }
        }
    },
    async deleteInstitutionLogo() {
        try {
            const { data } = await axios.delete(extension)
            return data
        } catch {
            return { deleted: false }
        }
    }
}

export default requests
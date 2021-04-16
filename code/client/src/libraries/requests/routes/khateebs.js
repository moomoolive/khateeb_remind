import helpers from './helpers.js'

import axios from 'axios'

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
    },
    async sendAvailabilityUpdateToAdmins(availabilityType="Date", options={}) {
        try {
            const res = await axios.post(helpers.targetURL([extension, "availability-change", availabilityType]), options)
            if (!res || isNaN(res.code))
                return 1
            else
                return res.code
        } catch {
            return 1
        }
    }
}

export default requests
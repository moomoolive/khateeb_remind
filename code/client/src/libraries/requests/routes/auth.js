import helpers from './helpers.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

import axios from 'axios'

const extension = helpers.targetURL('auth')

const requests = {
    async getToken(credentials) {
        try {
            const res = await axios.post(extension + '/', credentials)
            if (!res || !typeCheckingHelpers.isJWT(res.token))   
                throw { token: null }
            return res
        } catch {
            return { token: null }
        }
    },
    createInstitution(institutionAndAdminInfo={}) {
        return axios.post(extension + '/create/institution', institutionAndAdminInfo)
    },
    createKhateeb(khateebInfo={}) {
        return axios.post(extension + "/create/khateeb", khateebInfo)
    },
    sendVerificationCode(username={ username: "moomoo" }) {
        return axios.post(extension + '/forgot/password', username)
    },
    forgotUsername(phoneNumber={ phoneNumber: 100_000_0000 }) {
        return axios.post(extension + `/forgot/username`, phoneNumber)
    },
    verificationCodeCheck(passwordAndCode={}) {
        return axios.put(extension + '/verification-code', passwordAndCode)
    }
}

export default requests

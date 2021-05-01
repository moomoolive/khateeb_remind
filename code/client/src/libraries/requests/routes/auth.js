import helpers from './helpers.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

import axios from 'axios'

const extension = helpers.targetURL('auth')

const requests = {
    async getToken(credentials) {
        try {
            const res = await axios.post(extension + '/', credentials)
            if (!res || !typeCheckingHelpers.isJWT(res.token))   
                throw TypeError(`Response didn't include jwt`)
            return res
        } catch {
            return { token: null }
        }
    },
    async createInstitution(institutionAndAdminInfo={}) {
        try {
            const res = await axios.post(extension + '/create/institution', institutionAndAdminInfo)
            if (!res || isNaN(res.code) || !res.msg)
                throw TypeError(`Required info is missing`)
            else
                return { code: res.code, msg: res.msg }
        } catch {
            return { code: 1, msg: `An error occured when creating your institution` }
        }
    },
    async createUser(khateebInfo={}) {
        try {
            const res = await axios.post(extension + "/create/user", khateebInfo)
            if (!res || isNaN(res.code) || !res.msg)
                throw TypeError(`Required info is missing`)
            else
                return { code: res.code, msg: res.msg }
        } catch {
            return { code: 1, msg: `An error occured when signing you up` }
        }
    },
    async sendVerificationCode(username="moomoo") {
        try {
            const res = await axios.post(extension + '/forgot/password', { username })
            if (!res || isNaN(res.code) || !res.msg)
                throw TypeError(`Required info is missing`)
            else
                return { code: res.code, msg: res.msg }
        } catch {
            return { code: 1, msg: `An error occurred when attempting to send recovery email to ${username}` }
        }
    },
    async forgotUsername(email="random@random.com") {
        try {
            const res = await axios.post(extension + `/forgot/username`, { email })
            if (!res || isNaN(res.code) || !res.msg)
                throw TypeError(`Required info is missing`)
            else
                return { code: res.code, msg: res.msg }
        } catch {
            return { code: 1, msg: `An error occurred when attempting to send recovery email to ${email}` }
        }
    },
    async verificationCodeCheck(info={}) {
        try {
            const res = await axios.put(extension + '/verification-code', info)
            if (!res || isNaN(res.code) || !res.msg)
                throw TypeError(`Required info is missing`)
            else
                return { code: res.code, msg: res.msg }
        } catch {
            return { msg: `An error occured when verifying code`, code: 1 }
        }
    }
}

export default requests

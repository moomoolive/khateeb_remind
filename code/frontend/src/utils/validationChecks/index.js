import axios from 'axios'
import API_URL from '@/utils/API/routes/vars.js'

const helpers = {
    async checkValidCanadianAreaCode(code) {
        let response
        await axios.post(API_URL + '/misc/area-code', { code })
            .then((res) => {
                response = res.data !== 'exists'
            })
            .catch((err) => { console.log(err) })
        return response
    }
}

export default {
    phoneNumberLength(phoneNumber) {
        return phoneNumber.length !== 10
    },
    async phoneNumber(phoneNumber) {
        const incompleteNumber = this.phoneNumberLength(phoneNumber)
        const areaCodeExists = phoneNumber.length >= 3
        let canadianAreaCode;
        if (areaCodeExists) {
            const areaCode = phoneNumber.substring(0,3)
            canadianAreaCode = await helpers.checkValidCanadianAreaCode(areaCode)
        }
        return areaCodeExists ? incompleteNumber || canadianAreaCode : incompleteNumber
    }
}
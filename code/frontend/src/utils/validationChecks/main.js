import API from '@/utils/API/index.js'

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
            canadianAreaCode = await API.misc.checkValidCanadianAreaCode(areaCode)
        }
        return areaCodeExists ? incompleteNumber && canadianAreaCode : incompleteNumber
    },
    fieldIsEmpty(field) {
        return field.length < 1
    }
}
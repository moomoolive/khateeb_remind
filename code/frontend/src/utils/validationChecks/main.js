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
            canadianAreaCode = await this.$API.checkValidCanadianAreaCode(areaCode)
        }
        return areaCodeExists ? incompleteNumber || canadianAreaCode : incompleteNumber
    }
}
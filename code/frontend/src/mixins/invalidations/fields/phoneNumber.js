import validation from '@/utils/validationChecks/main.js'

export default {
    data() {
        return {
            phoneNumberNotValid: true
        }
    },
    computed: {
        phoneNumberWatcher() {
            if (!this.inputData) {
                const randomNonCanadianPhoneNumber = '999'
                return randomNonCanadianPhoneNumber
            }
            const x = this.inputData.options ? this.inputData.options : this.inputData
            return x.phoneNumber
        }
    },
    watch: {
        async phoneNumberWatcher() {
            this.phoneNumberNotValid = await validation.phoneNumber(this.phoneNumberWatcher)
        }
    }
}
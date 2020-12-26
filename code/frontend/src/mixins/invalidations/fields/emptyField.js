import validation from '@/utils/validationChecks/main.js'

export default {
    methods: {
        fieldIsEmpty(field) {
            const x = this.inputData.options ?  this.inputData.options : this.inputData
            return validation.fieldIsEmpty(x[field])
        }
    },
    computed: {
        emptyField() {
            if (!this.inputData) {
                return true
            }
            const validations = {}
            this.groupInvalidation.emptyField.forEach(field => { 
                validations[field] = this.fieldIsEmpty(field)
            })
            return validations
        },
    }
}
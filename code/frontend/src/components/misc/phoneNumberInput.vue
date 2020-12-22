<template>
    <div>
        <label for="number">Phone Number:</label><br>
        <input type="text" id="number" v-model="phoneNumber">
        <h4 v-if="phoneNumberNotValid">
            Invalid Canadian Phone Number
        </h4>
    </div>
</template>

<script>
import validation from '@/utils/validationChecks/main.js'
// to be continued in a better manner
export default {
    name: 'phoneNumberInput',
    props: {
        phoneNumber: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            phoneNumberNotValid: null,
            number: null
        }
    },
    created() {
        this.number = this.phoneNumber
        this.phoneNumberNotValid = validation.phoneNumberLength(this.phoneNumber)
    },
    watch: {
        async phoneNumber(newValue) {
            this.phoneNumberNotValid = await validation.phoneNumber(this.inputData.phoneNumber)
            this.$emit('notValid', this.phoneNumberNotValid)
        }
    }
}
</script>

<style>

</style>
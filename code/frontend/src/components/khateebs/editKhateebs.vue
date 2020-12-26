<template>
    <div class="gradient1">
        <previous-entries-dropdown 
            :inputData="inputData"
            :previousEntries="previousEntries"
            :selected="selected"
            @changed="selected = $event"
            :displayName="['firstName', 'lastName']"
        />
        <form-renderer
            :inputData="inputData"
            :textFieldInvalidMsg="{
                firstName: `default`,
                lastName: `default`,
                phoneNumber: `Invalid Canadian Phone Number`,
                email: `default`
            }"
            :doNotRender="['dropouts']"
        />
        <div>
            Dropouts: {{ inputData.dropouts }}
        </div>
        <button
            class="grey"
            @click="submit()"
            buttonText="Submit"
            :disabled="notReadyToSubmit"
        >
            Submit
        </button>
    </div>
</template>

<script>
import adminForms from '@/mixins/adminForms.js'
import validation from '@/utils/validationChecks/main.js'

export default {
    name: 'editKhateebs',
    mixins: [adminForms],
    data() {
        return {
            formName: 'Khateeb',
            phoneNumberNotValid: true
        }
    },
    methods: {
        click(event) {
            console.log(event)
        }
    },
    computed: {
        notReadyToSubmit() {
            if (this.inputData.firstName) {
                return (
                    this.firstNameNotValid || 
                    this.lastNameNotValid || 
                    this.phoneNumberNotValid
                )
            } else return true
        },
        firstNameNotValid() {
            return this.inputData.firstName.length  < 1
        },
        lastNameNotValid() {
            return this.inputData.lastName.length < 1
        },
        phone() {
            if (this.inputData.phoneNumber) return this.inputData.phoneNumber
            else return '403'
        }
    },
    async created() {
        const data = await this.$API.getKhateebs('yes')
        data.emptySchema.active = true
        this.assignAPIData(data)
    },
    watch: {
        async phone() {
            this.phoneNumberNotValid = await validation.phoneNumber(this.phone)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("green");

</style>
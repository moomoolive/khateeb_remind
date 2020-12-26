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
                phoneNumber: `Invalid canadian phone number`
            }"
            :doNotRender="['dropouts']"
            :groupInvalidation="groupInvalidation"
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
import invalidations from '@/mixins/invalidations/index.js'

export default {
    name: 'editKhateebs',
    mixins: [
        adminForms,
        invalidations.phoneNumber,
        invalidations.emptyField
    ],
    data() {
        return {
            formName: 'Khateeb',
            groupInvalidation: {
                emptyField: ['firstName', 'lastName', 'email']
            }
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
                    this.emptyField.firstName ||
                    this.emptyField.lastName ||
                    this.emptyField.email ||
                    this.phoneNumberNotValid
                )
            } else return true
        }
    },
    async created() {
        const data = await this.$API.admin.getKhateebs('yes')
        data.emptySchema.active = true
        this.assignAPIData(data)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("green");

</style>
<template>
    <div class="gradient1">
        <form-renderer
            :inputData="inputData.options"
            :textFieldInvalidMsg="{
                phoneNumber: `Invalid Canadian Phone Number`
            }"
            :groupInvalidation="groupInvalidation"
        />
        <button
            class="grey"
            @click="submit()"
            :disabled="notReadyToSubmit"
        >
            Submit
        </button>
    </div>
</template>

<script>
import formRenderer from '@/components/forms/formRenderer.vue'
import invalidations from '@/mixins/invalidations/index.js'

export default {
    name: 'adminDetails',
    mixins: [invalidations.emptyField, invalidations.phoneNumber],
    components: {
        formRenderer
    },
    data() {
        return {
            inputData: {
                __t: 'adminProfile',
                options: {}
            },
            groupInvalidation: {
                emptyField: ['firstName', 'lastName', 'email']
            }
        }
    },
    methods: {
        async submit() {
            const res = await this.$API.admin.updateSetting(this.inputData)
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
        const response = await this.$API.admin.getSetting(this.inputData.__t)
        if (response.previousEntries[0]) {
            this.inputData = response.previousEntries[0]
        } else this.inputData = response.emptySchema
    },
    updated() {
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("yellow", "green");
</style>
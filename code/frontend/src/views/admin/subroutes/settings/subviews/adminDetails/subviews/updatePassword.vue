<template>
    <div>
        <Form
            :name="`updated password`"
            :emptySchema="emptySchema"
            :invalidations="invalidations"
            :customInvalidMsg="customInvalidMsg"
            :backgroundColor="`blue-green`"
            @submitted="submit($event)"
        />
    </div>
</template>

<script>
import Form from '@/components/forms/formRenderer.vue'

export default {
    name: 'updatePassword',
    components: {
        Form
    },
    data() {
        return {
            inputData: {
                __t: 'password',
                options: '',
                confirm: ''
            },
            emptySchema: {
                confirmOldPassword: '',
                createNewPassword: '',
                confirmNewPassword: ''
            },
            invalidations: {
                invalidPassword: ['createNewPassword'],
                notEqual: {
                    confirmNewPassword: 'createNewPassword'
                }
            },
            customInvalidMsg: {
                createNewPassword: 'Your password must be longer than 6 characters',
                confirmNewPassword: `This doesn't equal your password above`
            }
        }
    },
    methods: {
        prepSaveData(info) {
            this.inputData.options = info.createNewPassword
            this.inputData.confirm = info.confirmOldPassword
        },
        async submit($event) {
            this.prepSaveData($event)
            const response = await this.$API.admin.updateSetting(this.inputData)
            if (response === 'Changes successfully made!') {
                this.$store.dispatch('adminSavedChangesScreen', true)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("blue", "green");
</style>
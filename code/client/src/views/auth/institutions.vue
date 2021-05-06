<template>
    <div>
        <loading>
            <institution-signup-form-template 
                :formProps="{
                    formTitle: 'Create an Institution',
                    bindedExts: ['states']
                }"
                @submitted="toAPI($event)"
            />
        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
// import institutionSignupFormTemplate from '@/components/forms/multiTieredForm/templates/institutionSignup.vue'
import institutionSignupFormTemplate from '@/components/forms/templates/institution.vue'

export default {
    name: "institutionSignUp",
    components: {
        loading,
        institutionSignupFormTemplate
    },
    methods: {
        async toAPI(formData={}) {
            const { code, msg } = await this._api.auth.createInstitution(formData)
            if (code !== 0)
                return this._utils.alert(msg)
            this._utils.alert(msg, 'success')
            return this._utils.toHomePage()
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
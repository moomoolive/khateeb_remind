<template>
    <div>
        <loading>
            <institution-signup-form-template @submitted="toAPI($event)"/>
        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import institutionSignupFormTemplate from '@/components/forms/multiTieredForm/templates/institutionSignup.vue'

export default {
    name: "institutionSignUp",
    components: {
        loading,
        institutionSignupFormTemplate
    },
    methods: {
        async toAPI(formData={}) {
            const { code, msg } = await this.$API.auth.createInstitution(formData)
            if (code !== 0)
                return this.utils.alert(msg)
            this.utils.alert(msg, 'success')
            return this.utils.toHomePage()
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
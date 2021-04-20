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
        async toAPI(formData) {
            try {
                const res = await this.$API.auth.createInstitution(formData)
                if (typeof res.status !== "undefined" && res.status === 'reserved')
                    return this.utils.alert(res.msg)
                this.utils.alert(res, 'success')
                this.utils.toHomePage()
            } catch(err) {
                console.log(err)
            }
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
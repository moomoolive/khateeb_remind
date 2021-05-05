<template>
    <div>
        <user-form-template
            :includeVitals="true"
            :formProps="{
                bindedExts: ['confirms'],
                backgroundColor: 'yellow',
                buttonColor: 'blue',
                buttonText: 'Sign up',
                formTitle: 'Create Account'
            }"
            @submitted="signupKhateeb($event)"
        />
    </div>
</template>

<script>
import userFormTemplate from '@/components/forms/templates/user.vue'

export default {
    name: "userSignup",
    components: {
        userFormTemplate,
    },
    data() {
        return {

        }
    },
    methods: {
        async signupKhateeb(info={}) {
            const { code, msg } = await this._api.auth.createUser(info)
            if (code !== 0)
                return this._utils.alert(msg)
            this._utils.alert(msg, 'success')
            return this._utils.toHomePage()
        },
    },
    computed: {

    },
    created() {
    }
}
</script>

<style>

</style>
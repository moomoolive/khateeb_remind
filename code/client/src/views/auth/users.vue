<template>
    <div>
        <user-form-template
            v-if="!$store.getters['user/isLoggedIn']"
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

        <general-message
            v-else
            :message="`Please logout to create a new account`"
            iconColor="yellow"
            :fontAwesomeIcon="['fas', 'sign-out-alt']"
        />

    </div>
</template>

<script>
import userFormTemplate from '@/components/forms/templates/user.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

export default {
    name: "userSignup",
    components: {
        userFormTemplate,
        generalMessage
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
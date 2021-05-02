<template>
    <div>
        <img :src="`${pathToPublicFolder}khateebRemind.png`">
        <div class="formContainer">

            <form-main
                :structure="{
                    username: {
                        required: true
                    },
                    password: {
                        type: 'protected',
                        required:true
                    }
                }"
                :basedOn="{
                    username: userCredentials.username,
                    password: ''
                }"
                :errorMsg="errorMsg"
                :rerenderOnBasedOnUpdate="false"
                :showInvalidationMsgs="false"
                :backgroundColor="`dark-blue`"
                :buttonText="`Log In`"
                :confirmBeforeSubmit="false"
                :disableIfSameAsStart="false"
                @submitted="login($event)"
            />

            <div>
                <a @click="forgotCredentials()">Forgot Username or Password?</a>
            </div>

        </div>
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'
import notificationHelpers from '@/libraries/notifications/main.js'

import localStorageHelpers from '@/libraries/localStorageManagement/main.js'

export default {
    name: "login",
    components: {
        formMain
    },
    data() {
        return {
            errorMsg: '',
            userCredentials: localStorageHelpers.get(this.userCredentialKey) || { username: '' },
            userCredentialKey: "userCredentials",
            pathToPublicFolder: process.env.BASE_URL
        }
    },
    methods: {
        async login(loginInfo={}) {
            const authRes = await this._api.auth.getToken(loginInfo)
            if (!authRes.token || authRes.msg !== 'success')
                return this.errorMsg = 'Incorrect Username or Password'
            this.$store.dispatch('user/updateToken', authRes.token)
            localStorageHelpers.commit(this.userCredentialKey, { username: loginInfo.username })
            this._api.user.getNotifications()
            return this._utils.toHomePage()
        },
        forgotCredentials() {
            notificationHelpers.redirectionOptions(
                [
                    { text: 'Username Recovery', to: '/forgot/username' },
                    { text: 'Password Recovery', to: '/forgot/password' }
                ]
            )
        }
    },
    created() {
        if (this.$store.getters['user/isLoggedIn']) {
            this._utils.toHomePage()
        }
    }
}
</script>

<style lang="scss" scoped>

img {
    width: 5vh;
    max-width: 50px;
    margin-top: 30px;
}

input {
    width: 15px;
    height: 15px;
    margin-right: 6px;
}

p {
    margin-top: 0;
    color: get-color("off-white");
}

a {
    position: relative;
    top: 50px;
    font-size: 19px;
    text-decoration: underline;
    font-weight: bold;
    cursor: default;
}

@media screen and (max-width: $phone-width) {

      a {
        font-size: 15px;
    }
}

</style>
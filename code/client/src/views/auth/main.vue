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
                    username: userCredentials,
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

            <div
                class="forgot-credentials-text " 
                @click="forgotCredentials()"
            >
                Forgot Username or Password?
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
            userCredentials: this.getUserCredentials() ||  '',
            userCredentialKey: "username",
            pathToPublicFolder: process.env.BASE_URL
        }
    },
    methods: {
        async login(loginInfo={}) {
            const authRes = await this._api.auth.getToken(loginInfo)
            if (!authRes.token || authRes.msg !== 'success') {
                return this.errorMsg = 'Incorrect Username or Password'
            }
            this.$store.dispatch('user/updateToken', authRes.token)
            this.setUserCredentials(loginInfo.username)
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
        },
        setUserCredentials(username="moomoo") {
            return localStorageHelpers.commit(this.userCredentialKey, username)
        },
        getUserCredentials() {
            // I honestly have no idea why using 'this.userCredentialKey'
            // doesn't find the target key in localstorage
            // it always returns null - so for now this will work
            return localStorageHelpers.get('username')
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
    min-width: 35px;
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

.forgot-credentials-text {
    position: relative;
    top: 50px;
    font-size: 19px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        color: get-color("yellow");
    }
}

@media screen and (max-width: $phone-width) {

    .forgot-credentials-text  {
        font-size: 15px;
    }
}

</style>
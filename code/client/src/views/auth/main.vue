<template>
    <div>
        <img :src="require('@/assets/logos/khateebRemindLogo.svg')">
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
                :backgroundColor="`darkBlue`"
                :buttonText="`Log In`"
                :confirmBeforeSubmit="false"
                :disableIfSameAsStart="false"
                @submitted="login($event)"
            >
                
                <div class="remember-me">
                    <div>
                        <input type="checkbox" v-model="userCredentials.remember">
                    </div>
                    <div>
                        <p>Remember Me</p>
                    </div>
                </div>

            </form-main>

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
            userCredentials: this.initialRememberMeValue()
        }
    },
    methods: {
        unconfirmedMsg(msg) {
            this.utils.alert(msg, 'caution', { icon: 'locked' })
        },
        async login(loginInfo={}) {
            const authRes = await this.$API.auth.getToken(loginInfo)
            if (!authRes.token && (authRes.msg === 'un-confirmed-khateeb' ||  authRes.msg === 'un-confirmed-institutionAdmin'))
                this.unconfirmedMsg(`Your administrator hasn't confirmed your account yet. Try again later!`)
            else if (!authRes.token && authRes.msg === 'un-confirmed-rootInstitutionAdmin')
                this.unconfirmedMsg(`Khateeb Remind hasn't confirmed your institution yet. Try again later!`)
            else if (authRes.token && authRes.msg === 'success') {
                this.$store.dispatch('user/updateToken', authRes.token)
                await this.$API.user.checkIn()
                this.$nextTick(() => this.toApp(authRes.token, loginInfo))
            }
            else
                this.errorMsg = 'Incorrect Username or Password'
        },
        loginRedirect() {
            const landingPage = this.$store.state.router.landingPage
            if (!this.$store.state.app.hasLoggedInViaLoginPage && landingPage !== this.$route.path) {
                this.$router.push(landingPage)
                this.$store.commit('app/loggedInViaLoginPage')
            }
            else
                this.utils.toHomePage()
        },
        initialRememberMeValue() {
            return {
                remember: false,
                username: ''
            }
        },
        getUserCredentials() {
            if (!localStorageHelpers.get('userCredentials'))
                localStorageHelpers.commit('userCredentials', this.initialRememberMeValue())
            this.userCredentials = localStorageHelpers.get('userCredentials')
        },
        toApp(token="edafjlfsdfaj.alfdkjaklsf.aldfajlfda", { username="moomoo" }) {
            if (this.userCredentials.remember) {
                localStorage.setItem('token', token)
                this.userCredentials.username = username
                localStorageHelpers.commit('userCredentials', this.userCredentials)
            }
            this.$nextTick(() => { this.loginRedirect() })
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
    computed: {
        rememberMe() {
            return this.userCredentials.remember
        }
    },
    watch: {
        rememberMe(newVal, OldVal) {
            if (!newVal && OldVal) {
                this.userCredentials.username = ''
                localStorageHelpers.commit('userCredentials', this.initialRememberMeValue())
            }
        }
    },
    created() {
        if (this.$store.getters['user/isLoggedIn'])
            this.utils.toHomePage()
        this.getUserCredentials()
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

.remember-me {
    margin-top: 5px;
    font-size: 15px;
    font-weight: bold;
    @include flexboxDefault();
    width: 40%;
    @include centerMargin();
}

p {
    margin-top: 0;
    color: getColor("offWhite");
}

a {
    position: relative;
    top: 50px;
    font-size: 19px;
    text-decoration: underline;
    font-weight: bold;
    cursor: default;
}

@media screen and (max-width: $phoneWidth) {
      
      .remember-me {
        font-size: 1.8vh;
      }

      input {
          width: 2vh;
          height: 2vh;
      }

      a {
        font-size: 15px;
    }
}

</style>
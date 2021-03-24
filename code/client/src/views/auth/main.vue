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
                :errorMsg="errorMsg"
                :showInvalidationMsgs="false"
                :backgroundColor="`darkBlue`"
                :buttonText="`Log In`"
                :confirmBeforeSubmit="false"
                @submitted="login($event)"
            >
                <div class="remember-me">
                    <input type="checkbox" v-model="rememberMe">
                    <p>Remember Me</p>
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

export default {
    name: "login",
    components: {
        formMain
    },
    data() {
        return {
            errorMsg: '',
            rememberMe: !!localStorage.getItem('rememberMe')
        }
    },
    methods: {
        unconfirmedMsg(msg) {
            this.utils.alert(msg, 'caution', { icon: 'locked' })

        },
        async login($event) {
            try {
                if (this.$store.getters.tokenExists)
                    return this.utils.alert(`You're already logged in! Logout if you want to login with another account.`)
                const authRes = await this.$API.auth.getToken($event)
                if (!authRes.token && (authRes.msg === 'un-confirmed-khateeb' ||  authRes.msg === 'un-confirmed-institutionAdmin'))
                    this.unconfirmedMsg(`Your administrator hasn't confirmed your account yet. Try again later!`)
                else if (!authRes.token && authRes.msg === 'un-confirmed-rootInstitutionAdmin')
                    this.unconfirmedMsg(`Khateeb Remind hasn't confirmed your institution yet. Try again later!`)
                else if (authRes.token && authRes.msg === 'success') {
                    this.toApp(authRes.token)
                    await this.$API.user.checkIn()
                }
            } catch(err) {
                if (err.status === 401)
                    this.errorMsg = 'Incorrect Username or Password'
            }
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
        toApp(token) {
            if (this.rememberMe)
                localStorage.setItem('token', token)
            this.$store.dispatch('user/updateToken', token)
            this.$nextTick(() => { this.loginRedirect() })
        },
        forgotCredentials() {
            notificationHelpers.redirectionOptions(
                [
                    { text: 'Forgot Username?', to: '/forgot/username' },
                    { text: 'Forgot Password?', to: '/forgot/password' }
                ]
            )
        }
    },
    watch: {
        rememberMe(newVal) {
            if (newVal) 
                localStorage.setItem('rememberMe', true)
            else
                localStorage.removeItem('rememberMe')
        }
    },
    created() {
        if (this.$store.getters['user/isLoggedIn'])
            this.utils.toHomePage()
    }
}
</script>

<style lang="scss" scoped>

img {
    width: 5vh;
    height: 5vh;
}

input {
    display: inline;
    width: 12px;
    height: 12px;
}

.remember-me {
    font-size: 15px;
    font-weight: bold;
    margin-top: 0px;
}

p {
    margin-top: 0;
    display: inline;
    color: getColor("offWhite");
}

a {
    position: relative;
    top: 25px;
    font-size: 16px;
    text-decoration: underline;
    font-weight: bold;
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
        font-size: 2.4vh;
        top: 5vh;
    }
}

</style>
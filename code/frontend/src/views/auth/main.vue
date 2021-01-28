<template>
    <div>
        <img :src="require('@/assets/logos/khateebRemindLogo.svg')">
        <div class="formContainer">
            <form-main
                :structure="formStructure"
                :errorMsg="errorMsg"
                :showInvalidationMsgs="false"
                :backgroundColor="`darkBlue`"
                :buttonText="`Log In`"
                @submitted="login($event)"
            >
                <div class="remember-me">
                    <input type="checkbox" v-model="rememberMe">
                    <p>Remember Me</p>
                </div>
            </form-main>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import formMain from '@/components/forms/main.vue'

export default {
    name: "login",
    components: {
        formMain
    },
    data() {
        return {
            formStructure: {
                username: {
                    required: true
                },
                password: {
                    type: "protected",
                    required: true
                }
            },
            errorMsg: '',
            rememberMe: !!localStorage.getItem('rememberMe')
        }
    },
    methods: {
        async login($event) {
            try {
                const authRes = await this.$API.auth.getToken($event)
                if (!authRes.token && authRes.msg === 'un-confirmed-khateeb') {
                    const notification = { color: 'yellow', icon: "locked", msg: `Your administrator hasn't confirmed your account yet. Try again later!`, textSize: 'small' }
                    this.$store.dispatch('createNotification', { type: 'alert', options: notification })
                }
                else if (!authRes.token && authRes.msg === 'un-confirmed-institutionAdmin') {
                    const notification = { color: 'yellow', icon: "locked", msg: `Khateeb Remind hasn't confirmed your institution yet. Try again later!`, textSize: 'small' }
                    this.$store.dispatch('createNotification', { type: 'alert', options: notification })
                }
                else if (authRes.token && authRes.msg === 'default')
                    console.log('default')
                else if (authRes.token && authRes.msg === 'success')
                    this.toApp(authRes.token)
            } catch(err) {
                if (err.status === 401)
                    this.errorMsg = 'Incorrect Username or Password'
            }
        },
        toApp(token) {
            if (this.rememberMe)
                localStorage.setItem('token', token)
            axios.defaults.headers.common['authorization'] = token
            this.$store.dispatch('JWT_TOKEN', token)
            this.$nextTick(() => {
                this.$router.push(`/${this.$store.getters.decodedJWT.__t}/`)
            })
        },
        institutionSignup() {
            this.$router.push('/create/institutions')
        },
        khateebSignup() {
            this.$router.push('/create/khateebs')
        }
    },
    watch: {
        rememberMe(newVal) {
            if (newVal) 
                localStorage.setItem('rememberMe', 'yes')
            else
                localStorage.removeItem('rememberMe')
        }
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

@media screen and (max-width: $phoneWidth) {
      .remember-me {
        font-size: 1.8vh;
      }
      input {
          width: 2vh;
          height: 2vh;
      }
}

</style>
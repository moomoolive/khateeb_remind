<template>
    <div>
        <img :src="require('@/assets/logos/khateebRemindLogo.svg')">
        <div class="formContainer">
            <formMain
                :structure="formStructure"
                :errorMsg="errorMsg"
                :showInvalidationMsgs="false"
                :backgroundColor="`darkBlue`"
                :buttonText="`Log In`"
                @submitted="login($event)"
            />
        </div>
        <div class="remember-me">
            <slider-button @toggled="saveToken($event)" :basedOn="rememberMe"/>
            <p>Remember Me?</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import formMain from '@/components/forms/main.vue'
import sliderButton from '@/components/userInterface/components/sliderButton.vue'

export default {
    name: "login",
    components: {
        formMain,
        sliderButton
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
        saveToken($event) {
            if ($event) 
                localStorage.setItem('rememberMe', 'yes')
            else
                localStorage.removeItem('rememberMe')
        },
        toApp(token) {
            if (localStorage.getItem('rememberMe'))
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
    }
}
</script>

<style lang="scss" scoped>

img {
    width: 5vh;
    height: 5vh;
}



.remember-me {
    font-size: 13px;
    font-weight: bold;
    margin-top: 50px;
}

p {
    margin-top: 0;
}

@media screen and (max-width: $phoneWidth) {
      .remember-me {
        font-size: 1.4vh;
        margin-top: 5vh;
      }
}

</style>
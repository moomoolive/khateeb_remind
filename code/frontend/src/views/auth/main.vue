<template>
    <div class="page">
        <div class="loginContainer">
            <img style="display: inline;" :src="require('@/assets/logos/khateebRemindLogo.svg')">
            <div class="formContainer">
                <formMain
                    :structure="formStructure"
                    :errorMsg="errorMsg"
                    :showInvalidationMsgs="false"
                    :backgroundColor="`none`"
                    @submitted="login($event)"
                />
                <!-- <div class="signUp">
                    <p class="signUpTitle">Sign Up</p>
                    <div class="signUpBtn">
                        <button class="blue" @click="institutionSignup()">
                            Institutions
                        </button>
                    </div>
                    <div class="signUpBtn">
                        <button @click="khateebSignup()">
                            Khateebs
                        </button>
                    </div>
                </div> -->
            </div>
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
            errorMsg: ''
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
                    this.storeToken(authRes.token)
            } catch(err) {
                if (err.status === 401)
                    this.errorMsg = 'Incorrect Username or Password'
            }
        },
        storeToken(token) {
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
.formContainer {
    margin-top: 2vh;
    background: themeRGBA("darkBlue", 0.2);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 7px;
}

.loginContainer {
    width: 40vh;
}

.page {
    display: flex;
    align-content: center;
    justify-content: center;
}

img {
    width: 5vh;
    height: 5vh;
}


</style>
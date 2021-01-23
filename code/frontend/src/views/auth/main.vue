<template>
    <div>
        <div class="welcomeContainer">
            <div class="titleContainer">
                <img style="display: inline;" :src="require('@/assets/logos/khateebRemindLogo.svg')">
                <p class="title" style="display: inline;">Khateeb Remind</p>
            </div>
            <div class="subTitleContainer">
                <p class="subTitle">Khateeb Scheduling.</p>
                <p class="subTitle">Without the Mess.</p>
            </div>
        </div>
        <formMain
            :structure="formStructure"
            :errorMsg="errorMsg"
            :showInvalidationMsgs="false"
            @submitted="login($event)"
        />
        <div class="signUp">
            <p class="signUpTitle">Sign Up</p>
            <div class="signUpBtn">
                 <button class="blue" @click="institutionSignUp()">
                    Institutions
                 </button>
            </div>
            <div class="signUpBtn">
                <button>Khateebs</button>
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
                //temp
                this.$router.push(`/sysAdmin/`)
            })
        },
        institutionSignUp() {
            this.$router.push('/institutions')
        }
    }
}
</script>

<style lang="scss" scoped>

.welcomeContainer {
    margin-top: 3vh;
    margin-bottom: 3vh;
}

.titleContainer {
    border-bottom: black 0.5vh dotted;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.subTitleContainer {
    margin-top: 3vh;
    margin-bottom: 5vh;
}

.title {
    font-size: 4vh;
    font-weight: bold;
    margin-left: 2vh;
}

.subTitle {
    font-size: 2vh;
    font-weight: bold;
    line-height: 0.5vh;
}

img {
    width: 5vh;
    height: 5vh;
}

.signUp {
    margin-top: 4vh;
}

.signUpBtn {
    display: inline;
}

.signUpTitle {
    font-weight: bold;
    font-size: 2.5vh;
}

</style>
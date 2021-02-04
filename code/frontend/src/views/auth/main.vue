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
                if (this.$store.getters.tokenExists) {
                    this._.alert(`You're already logged in! Log out if you want to login with another account.`)
                    return
                }
                const authRes = await this.$API.auth.getToken($event)
                if (!authRes.token && (authRes.msg === 'un-confirmed-khateeb' ||  authRes.msg === 'un-confirmed-institutionAdmin')) {
                    const notification = { color: 'yellow', icon: "locked", msg: `Your administrator hasn't confirmed your account yet. Try again later!`, textSize: 'small' }
                    this.$store.dispatch('createNotification', { type: 'alert', options: notification })
                }
                else if (!authRes.token && authRes.msg === 'un-confirmed-rootInstitutionAdmin') {
                    const notification = { color: 'yellow', icon: "locked", msg: `Khateeb Remind hasn't confirmed your institution yet. Try again later!`, textSize: 'small' }
                    this.$store.dispatch('createNotification', { type: 'alert', options: notification })
                }
                else if (authRes.token && authRes.msg === 'success') {
                    this.toApp(authRes.token)
                    this.$store.dispatch('storeNotificationsFromAPI', authRes.notifications)
                    authRes.notifications.forEach(note =>{
                        if (!note.seen) {
                            this.notificationCreator(note)
                        }
                    })
                }
            } catch(err) {
                if (err.status === 401)
                    this.errorMsg = 'Incorrect Username or Password'
            }
        },
        notificationCreator(notification) {
            if (notification.__t === 'generalNotification') {
                if (notification.tag === "welcome") {
                const options = {
                    type: 'alert',
                    options: {
                    color: 'green',
                    textSize: 'small',
                    icon: 'asalam',
                    graphicType: 'gif',
                    msg: notification.msg,
                    _id: notification._id,
                    notificationOrigin: 'server'
                    }
                }
                this.$store.dispatch('createNotification', options)
                }
            } 
        },
        toApp(token) {
            if (this.rememberMe)
                localStorage.setItem('token', token)
            axios.defaults.headers.common['authorization'] = token
            this.$store.dispatch('JWT_TOKEN', token)
            this.$nextTick(() => {
                this._.toHomePage()
            })
        },
        forgotCredentials() {
            this._.alert(`This feature isn't available yet!`)
        }
    },
    watch: {
        rememberMe(newVal) {
            if (newVal) 
                localStorage.setItem('rememberMe', 'yes')
            else
                localStorage.removeItem('rememberMe')
        }
    },
    created() {
        if (this.$store.getters.isJWTValid)
            this._.toHomePage()
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
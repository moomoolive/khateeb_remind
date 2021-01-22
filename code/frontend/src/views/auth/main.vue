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
                 <button class="blue" @click="$router.push('/institutions')">
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
                if (!authRes.token && authRes.msg === 'un-confirmed-khateeb')
                    this.errorMsg = `Your administrator hasn't confirmed your account yet! Try again in a few days.`
                else if (!authRes.token && authRes.msg === 'un-confirmed-institutionAdmin')
                    this.errorMsg = `'khateebs.com' hasn't confirmed your institution yet! Try again in a few days`
                else if (authRes.token && authRes.msg === 'default')
                    console.log('default')
                else if (authRes.token && authRes.msg === 'success')
                    this.storeToken(authRes.token)
            } catch(err) {
                console.log(err)
            }
        },
        storeToken(token) {
            localStorage.setItem('token', token)
            axios.defaults.headers.common['authorization'] = token
            this.$store.dispatch('JWT_TOKEN', token)
            this.$nextTick(() => {
                //this.$router.push(`/admin/${this.instituteName}/dashboard`)
                // push to whereever is relevant
            })
        },
        institutionSignUp() {
            console.log('institution sign up')
            //this.$router.push('/institutions')
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
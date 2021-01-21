<template>
    <div>
        <formMain
            :structure="formStructure"
            :errorMsg="errorMsg"
            @submitted="login($event)"
        />
        <button class="blue" @click="$router.push('/institutions')">Institution Sign-up</button>
        <button>Khateeb Sign-up</button>
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
                    required: true,
                    default: '',
                    minLength: 1
                },
                password: {
                    type: "password",
                    required: true,
                    default: '',
                    minLength: 1
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

<style>

</style>
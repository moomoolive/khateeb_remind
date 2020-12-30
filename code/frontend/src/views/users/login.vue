<template>
    <div>
        <msg-with-pic
            msg="No services will work until the issue is resolved insha'Allah"
            gif="planeFail"
            title="Your Khateeb Remind API is not responding"
            v-if="APIError"
        />
        <div v-if="showForm">
            <Form
                :name="`verify password`"
                :emptySchema="emptySchema"
                :backgroundColor="`none`"
                :buttonColor="`green`"
                :verifyBeforeAction="false"
                @submitted="attemptAuthorization($event)"
            />
            <h2 v-if="error">Incorrect Password</h2>
            <button
                class='blue'
                @click="switchForms()"
                v-if="!forgotPassword"
            >
                Forgot Password ?
            </button>
        </div>
        <div v-if="forgotPassword">
            <h2 v-if="textSent">
                A text with a verification code was sent to the<br>
                adminstrator's phone.It should arrive shortly.
            </h2> 
            <Form
                :name="`new password`"
                :emptySchema="forgotPasswordSchema"
                :invalidations="invalidations"
                :customInvalidMsg="customInvalidMsg"
                :backgroundColor="`none`"
                :buttonText="`Reset Password`"
                :buttonColor="`yellow`"
                @submitted="attemptPasswordCreation($event)"
            />
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Form from '@/components/forms/formRenderer.vue'

export default {
    name: 'login',
    components: {
        Form
    },
    data() {
        return {
            showForm: true,
            forgotPassword: false,
            textSent: false,
            error: false,
            APIError: false,
            emptySchema: {
                password: ''
            },
            forgotPasswordSchema: {
                verificationCode: '',
                createNewPassword: '',
                confirmNewPassword: ''
            },
            invalidations: {
                invalidPassword: ['createNewPassword'],
                notEqual: [
                    ['createNewPassword', 'confirmNewPassword']
                ],
                emptyField: ['createNewPassword']
            },
            customInvalidMsg: {
                createNewPassword: 'Your password must be longer than 6 characters',
                confirmNewPassword: `This doesn't equal your password above`
            }
        }
    },
    methods: {
        async attemptAuthorization($event) {
            const token = await this.$API.users.login($event.password)
            if (!token) {
                this.showForm = false
                this.APIError = true
            }
            if (token) {
                this.storeToken(token)
            } else this.error = true
        },
        storeToken(token) {
            localStorage.setItem('token', token.token)
            axios.defaults.headers.common['authorization'] = token.token
            this.$store.dispatch('JWT_TOKEN', token.token)
            this.$nextTick(() => {
                this.$router.push(`/admin/${this.instituteName}/dashboard`)
            })
        },
        switchForms() {
            this.showForm = false
            this.forgotPassword = true
            this.sendVerificationText()
        },
        async sendVerificationText() {
            const res = await this.$API.misc.requestVerificationCode()
            if (res !== 'Text was sent') {
                alert(`We weren't able to send a verification text`)
            } else this.textSent = true
        },
        async attemptPasswordCreation($event) {
            const res = await this.$API.misc.sendVerificationCode($event)
            console.log(res)
            if (res === 'success') {
                alert('You have successfully changed your password!')
                this.forgotPassword = false
                this.showForm = true
            }
            else if (res === 'unauthorized') alert(res)
            else alert('A problem occurred. Please try again later.')
        }
    }
}
</script>
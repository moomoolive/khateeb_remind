<template>
    <div>
        <button
            class="yellow"
            @click="$emit('back')"
        >
            Back to Login
        </button><br>
        <button
            class="blue"
            @click="sendText()"
            v-if="!resetPassword"
        >
            Click to Send Verification Text
        </button>
        <div v-if="responseRecieved">
            <h2>{{ msg.headline }}</h2>
            <h3>{{ msg.rest }}</h3>
            <div v-if="textSent">
                <input type="text" v-model="code">
                    <button
                        class="grey"
                        @click="verifyCode()"
                    >
                        Submit
                    </button>
                </div>
                <h4 v-if="invalidCode">That's the wrong code</h4>
        </div>
        <div v-if="resetPassword">
            <h3>Enter Your New Password:</h3>
            <input type="text" v-model="password.new">
            <h3>Confirm Password:</h3>
            <input type="text" v-model="password.confirm"><br>
            <button
                :disabled="passwordMismatch"
                @pushed="savePassword()"
            >
                Submit
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'textReset',
    data() {
        return {
            code: '',
            textSent: false,
            responseRecieved: false,
            invalidCode: false,
            token: '',
            resetPassword: false,
            password: {
                new: '',
                confirm: ''
            },
            msg: {
                headline: 'Verfication text has been sent. It should arrive shortly.',
                rest: 'Enter code here once you recieve it:'
            }
        }
    },
    methods: {
        async sendText() {
            const response = await this.$API.requestVerificationCode()
            if (response !== 'texted') {
                this.msg.headline = `We weren't able to send a verification text.`
                this.msg.rest = `Try again later`
            } else this.textSent = true
            this.responseRecieved = true
        },
        async verifyCode() {
            const response = await this.$API.sendVerificationCode(this.code)
            if (response.msg === `verified`) {
                this.token = response.token
                this.responseRecieved = false
                this.resetPassword = true
            } else this.invalidCode = true
        },
        async savePassword() {
            const requestData = {
                token: this.token,
                passwordInfo: {
                    name: 'password',
                    options: this.password.new
                }
            }
            const response = await this.$API.savePassword(requestData)
            if (response === 'success') {
                this.resetPassword = false
                this.responseRecieved = true
                this.textSent = false
                this.msg.headline = `You're New Password has Been Saved!`
                this.msg.rest = `Next time don't forget your password :)`
                this.token = ''
            }
        }
    },
    computed: {
        passwordMismatch() {
            return this.password.new !== this.password.confirm
        }
    }
}
</script>

<style>

</style>
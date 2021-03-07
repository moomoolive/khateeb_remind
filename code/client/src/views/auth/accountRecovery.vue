<template>
    <div>
        <div class="container">
            <div class="input-container">
                <h1>{{ header }}</h1>
                <input
                    v-if="!codeSent" 
                    type="text" 
                    v-model="input" 
                    :maxlength="username ? maxPhoneNumberLength : null"
                >
                <div v-if="codeSent" >
                    <input
                        type="text" 
                        v-model="verificationCode" 
                        :maxlength="20"
                    >
                    <h1>Enter Your New Password</h1>
                    <h2>Password Must be at least 6 characters</h2>
                    <input 
                        type="text" 
                        v-model="newPassword" 
                        :maxlength="20"
                    >
                </div>
                <button 
                    class="grey"
                    :disabled="!readyToSubmit"
                    @click="codeSent ? createNewPassword() : submit(input)"
                >
                    {{ btnText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "accountRecovery",
    data() {
        return {
            input: '',
            username: this.$router.currentRoute.params.type === 'username',
            maxPhoneNumberLength: 14,
            codeSent: false,
            verificationCode: '',
            newPassword: '',
            userID: null
        }
    },
    methods: {
        phoneNumber(input) {
            return this.utils.isNumeric(this.removePhoneNumberHelpers(input)) && input.length === this.maxPhoneNumberLength
        },
        usernameValidation(input) {
            return input.length > 0
        },
        async submit(data) {
            try {
                data = this.username ? parseInt(this.removePhoneNumberHelpers(data)) : data
                const submitType = this.username ? 'username' : 'password'
                const res = await this.$API.auth.forgot(submitType, { data })
                if(typeof res.status !== 'undefined') {
                    if (res.status === 'error')
                        return this.utils.alert(res.msg)
                    if (res.status === 'code') {
                        this.userID = res.userID
                        this.utils.alert(res.msg, "success")
                        return this.codeSent = true
                    }
                }
                this.utils.alert(res, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        },
        async createNewPassword() {
            try {
                const info = {
                    code: this.verificationCode, 
                    password: this.newPassword,
                    userID: this.userID
                }
                const res = await this.$API.auth.verificationCode(info)
                if (res.status === 'error') 
                    return this.utils.alert(res.msg)
                this.utils.alert(res.msg, "success")
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        },
        removePhoneNumberHelpers(phoneNumber) {
            return phoneNumber.replace(/-|\(|\)/g, "")
        }
    },
    watch: {
        input(newVal, oldVal) {
            if (!this.username)
                return
            if (newVal.length === 3 && oldVal.length === 2)
                this.input = `(${newVal})`
            else if (newVal.length === 4 && oldVal.length === 5)
                this.input = newVal.slice(1, -1)
            else if (newVal.length === 6  && oldVal.length === 7)
                this.input = newVal.slice(0, -1)
            else if (newVal.length === 6 && oldVal.length === 5)
                this.input = `${newVal.slice(0, -1)}-${newVal.slice(-1)}`
            else if (newVal.length === 10 && oldVal.length === 9)
                this.input = `${newVal.slice(0, -1)}-${newVal.slice(-1)}`
            else if (newVal.length === 10 && oldVal.length === 11)
                this.input = newVal.slice(0, -1)
        }
    },
    computed: {
        readyToSubmit() {
            if (this.codeSent)
                return this.newPassword.length > 5
            if (this.username)
                return this.phoneNumber(this.input)
            else
                return this.usernameValidation(this.input)
        },
        header() {
            if (this.codeSent)
                return `Enter Your Verification Code`
            else
                return `Enter Your ${ this.username ? 'Phone Number' : 'Username'}`
        },
        btnText() {
            const submitText = 'Submit'
            if (this.codeSent)
                return 'Submit'
            if (this.username)
                return !this.readyToSubmit ? 'Invalid Phone Number' : submitText
            else
                return !this.readyToSubmit ? 'Invalid Username' : submitText
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 80%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-container {
    background: getColor("orange");
    height: auto;
    max-height: 400px;
    width: 80%;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
    border-radius: 7px;
}

h1 {
    font-size: 30px;
}

h2 {
    font-size: 25px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

button {
    width: 85%;
    height: 5.5vh;
    max-height: 50px;
    border-radius: 0;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
    font-size: 20px;
    margin-top: 20px;
}

input {
    width: 84.5%;
    height: 3.3vh;
    max-height: 28px;
    background: getColor("lightGrey");
    border: 0;
    outline: 0;
    color: getColor("offWhite");
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
}

@media screen and (max-width: $phoneWidth) {
    .input-container {
        width: 90%;
    }
    .container {
        width: 90%;
    }
    h1 {
        font-size: 4vh;
    }
    h2 {
        font-size: 3.3vh;
    }
    button {
        font-size: 2.3vh;
        margin-top: 15px;
    }
}

</style>
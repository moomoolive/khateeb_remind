<template>
    <div style="padding-top: 20px;">
        <h2>Enter Secret Key</h2>
        <form>
            <input type="text" v-model="secretKey"><br><br>
        </form>
        <button
            @click="submit()"
            :disabled="noInput"
        >
            Submit
        </button><br>
        <h5 v-if="error">Incorrect Key</h5>
        <button
            class="yellow"
            @click="$emit('alt', 'first')"
            v-if="!passwordExists"
        >
            First Time?
        </button>
        <button
            class='blue'
            @click="$emit('alt', 'text')"
            v-if="passwordExists"
        >
            Forgot Password?
        </button>
    </div>
</template>

<script>
import axios from 'axios'

export default{
    name: 'loginForm',
        data() {
            return {
                secretKey: null,
                instituteName: this.$store.state.institution,
                error: false,
                passwordExists: false
            }
        },
        methods: {
            async submit() {
                const token = await this.$API.users.login(this.secretKey)
                if (!token) this.$emit("alt", "no API response")
                if (token) {
                    localStorage.setItem('token', token.token)
                    axios.defaults.headers.common['authorization'] = token.token
                    this.$store.dispatch('JWT_TOKEN', token.token)
                    this.$nextTick(() => {
                        this.$router.push(`/admin/${this.instituteName}/dashboard`)
                    })
                } else this.error = true
            },
            async password() {
                const response = await this.$API.initialize.passwordExists()
                if ( response === 'exists') this.passwordExists = true
            }
        },
        computed: {
            noInput() {
                return this.secretKey <= 0
            }
        },
        created() {
            this.password()
        }
}
</script>

<style>
input {
    border: solid black 1px;
}

</style>
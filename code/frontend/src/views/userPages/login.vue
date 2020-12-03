<template>
    <div style="padding-top: 20px;">
        <h2>Enter Your Secret Key</h2>
        <form @submit="submit">
            <input type="text" v-model="secretKey"><br><br>
            <input type="submit" value="Submit">
        </form>
        <h5 v-if="error">Incorrect Key</h5>
    </div>
</template>

<script>
import API from '../../utils/apiCalls.js'

export default {
    name: 'login',
    data() {
        return {
            secretKey: null,
            instituteName: this.$store.state.institution, //hardcoded for now
            error: false
        }
    },
    methods: {
        async submit(event) {
            event.preventDefault()
            const token = await API.login(this.secretKey)
            this.$store.dispatch('JWT_TOKEN', token.token)
            localStorage.setItem('token', token.token)
            console.log(token)
            if (token.token) {
                this.$nextTick(() => {
                    this.$router.push(`/admin/${this.instituteName}/dashboard`)
                })
            } else this.error = true
        }
    }
}
</script>

<style>

</style>
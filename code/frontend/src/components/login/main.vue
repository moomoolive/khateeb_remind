<template>
    <div>
        <login-form
            v-if="selected === 'form'"
            @alt="selected = $event"
        />
        <first-time
            v-if="selected === 'first'"
            @back="selected = 'form'"
        />
        <reset-password
            v-if="selected === 'text'"
            @back="selected = 'form'"
        />
    </div>
</template>

<script>
import loginForm from './components/loginForm.vue'
import firstTime from './components/firstTime.vue'
import resetPassword from './components/resetPassword.vue'

export default {
    name: 'loginMain',
    components: {
        loginForm,
        firstTime,
        resetPassword
    },
    data() {
        return {
            selected: 'form'
        }
    },
    watch: {
        selected(newVal) {
            if (newVal === 'no API response') {
                this.$emit('no-API')
            }
        }
    }
}
</script>

<style>

</style>
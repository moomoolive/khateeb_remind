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
import loginForm from '@/components/login/loginForm.vue'
import firstTime from '@/components/login/firstTime.vue'
import resetPassword from '@/components/login/resetPassword.vue'

export default {
    name: 'login',
    components: {
        loginForm,
        firstTime,
        resetPassword
    },
    data() {
        return {
            initial: false,
            selected: 'form'
        }
    },
    async created() {
    }
}
</script>

<style>

</style>
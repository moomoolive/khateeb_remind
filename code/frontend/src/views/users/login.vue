<template>
    <div>
        <msg-with-pic
            msg="No services will work until the issue is resolved insha'Allah"
            gif="planeFail"
            title="Your Khateeb Remind API is not responding"
            v-if="selected === 'no API response'"
        />
        <div v-if="selected !== 'no API response'">
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
            selected: 'form'
        }
    },
    async created() {
    }
}
</script>

<style>

</style>
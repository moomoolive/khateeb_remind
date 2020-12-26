<template>
    <div>
        <msg-with-pic
            msg="No services will work until the issue is resolved insha'Allah"
            gif="planeFail"
            title="Your Khateeb Remind API is not responding"
            v-if="!showForm"
        />
        <login-main
            @no-API="showForm = false"
            v-if="showForm"
        />
    </div>
</template>

<script>
import loginMain from '@/components/login/main.vue'

export default {
    name: 'login',
    components: {
        loginMain
    },
    data() {
        return {
            showForm: true
        }
    },
    async created() {
    }
}
</script>

<style>

</style>
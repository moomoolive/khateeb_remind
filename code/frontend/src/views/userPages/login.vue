<template>
    <div style="padding-top: 20px;">
        <login-form />
    </div>
</template>

<script>
import axios from 'axios'

import loginForm from '@/components/login/loginForm.vue'

export default {
    name: 'login',
    components: {
        loginForm
    }
}
</script>

<style>

</style>
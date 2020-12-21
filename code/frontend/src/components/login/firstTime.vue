<template>
    <div style="padding-top: 20px;">
        <button
            class="yellow"
            @click="$emit('back')"
        >
            Back to Login
        </button>
        <h2>Enter Your API Security Key</h2>
        <input type="text" v-model="API">
        <h2>Enter Your First Password</h2>
        <input type="text" v-model="data.options"><br>
        <button
            @pushed="submit()"
        >
            Submit
        </button>
    </div>
</template>

<script>
export default {
    name: 'passwordInitalization',
    data() {
        return {
            API: '',
            data: {
                name: 'password',
                options: ''
            }
        }
    },
    methods: {
        submit() {
            this.$API.initializePassword(this.$data)
        }
    }
}
</script>

<style>

</style>
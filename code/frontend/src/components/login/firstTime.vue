<template>
    <div style="padding-top: 20px;">
        <cool-btn
            color="yellow"
            buttonText="Back to Login"
            @pushed="$emit('back')"
        />
        <h2>Enter Your API Security Key</h2>
        <input type="text" v-model="API">
        <h2>Enter Your First Password</h2>
        <input type="text" v-model="data.options">
        <cool-btn
            style="margin-top: 10px;"
            buttonText="Submit"
            @pushed="submit()"
        />
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
<template>
    <div>
        <button @click="toCLI()">To Cli</button>
    </div>
</template>

<script>
export default {
    name: 'sysAdminDashboard',
    methods: {
        toCLI() {
            this.$router.push('/sysAdmin/cli')
        }
    }
}
</script>

<style>

</style>
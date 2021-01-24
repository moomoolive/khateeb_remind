<template>
    <div>
        <button @click="toCLI()">To Cli</button>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'sysAdminDashboard',
    methods: {
        toCLI() {
            this.$router.push('/root/cli')
        }
    }
}
</script>

<style>

</style>
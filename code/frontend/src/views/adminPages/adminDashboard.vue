<template>
    <div>
        <h2>Hello</h2>
        <button @click="click">set schedule</button>
    </div>
</template>

<script>
export default {
    name: 'adminDashboard',
    data() {
        return {
            instituteName: this.$store.state.institution
        }
    },
    methods: {
        click() {
            this.$router.push(`/admin/${this.instituteName}/schedule`)
        }
    }
}
</script>

<style>

</style>
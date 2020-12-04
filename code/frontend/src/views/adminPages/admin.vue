<template>
    <div style="padding-top: 20px;">
        <div>
            <button @click="click('schedule')">set schedule</button>
            <button @click="click('dashboard')">Dashboard/Admin Home</button>
            <button @click="click('announcements')">Announcements</button>
            <button @click="click('khateebs')">Khateebs</button>
            <button @click="click('location-settings')">Location Settings</button>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'adminParentRoute',
    data() {
        return {
            instituteName: this.$store.state.institution
        }
    },
    methods: {
        click(extension) {
            this.$router.push(`/admin/${this.instituteName}/${extension}`)
        }
    }
}
</script>

<style>

</style>
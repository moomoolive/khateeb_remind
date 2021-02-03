<template>
    <div>
        {{ notifications }}
    </div>
</template>

<script>
export default {
    name: 'userNotifications',
    data() {
        return {
            notifications: this.$store.state.notificationsFromServer
        }
    }
}
</script>

<style>

</style>
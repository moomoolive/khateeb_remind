<template>
    <div style="padding-top: 20px;">
        <user-announcements />
    </div>
</template>

<script>
import userAnnouncements from '@/components/announcements/user.vue'

export default {
    name: 'announcements',
    components: {
        userAnnouncements
    }
}
</script>

<style>

</style>
<template>
    <div style="padding-top: 20px;">
        <div v-for="(announcement, ID) in announcements" :key="ID">
            <collapsable-box 
            :content="announcement.content"
            :headline="`${announcement.date} || ${announcement.headline}`"
            :isUrgent="announcement.urgent"
            :isVeryImportant="announcement.important"
            />
        </div>
    </div>
</template>

<script>
import API from '../utils/apiCalls.js'

export default {
    name: 'announcements',
    data() {
        return {
            announcements: null
        }
    },
    async created() {
        this.announcements = await API.announcements()
    }
}
</script>

<style>

</style>
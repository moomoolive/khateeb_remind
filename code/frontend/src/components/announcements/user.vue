<template>
    <div>
        <div v-for="(announcement, ID) in announcements" :key="ID">
            <collapsable-box
            :headline="`${dateLoader(announcement.savedOn)} || ${announcement.headline}`"
            :options="{
                body: announcement.content
            }"
            pathToComponentFromComponents='announcements/announcementBody'
            :tagDetails="tagLoader(announcement)"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'userAnnouncements',
    data() {
        return {
            announcements: null,
            lastVisit: this.$store.state.lastVisit
        }
    },
    methods: {
        tagLoader(announcement) {
            let tagArray = []
            if (announcement.important === 'true') {
                tagArray.push('important')
            }
            if (announcement.urgent === 'true') {
                tagArray.push('urgent')
            }
            if (this.isNew(announcement.savedOn)) {
                tagArray.push('new')
            }
            return tagArray
        },
        dateLoader(stringDate) {
            const date = new Date(stringDate)
            const month = date.toLocaleString('default', {month: 'short'})
            const day = date.getDate()
            return `${month} ${day}`
        },
        isNew(announcementDate) {
            const date = new Date(announcementDate)
            return date > this.lastVisit
        }
    },
    async created() {
        this.announcements = await this.$API.announcements()
        if (this.announcements.length < 1 || !this.announcements) this.$emit('announcements', false)
        this.$emit('announcements', true)
    }
}
</script>

<style>

</style>
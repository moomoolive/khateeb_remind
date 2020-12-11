<template>
    <div style="padding-top: 20px;">
        <div v-for="(announcement, ID) in announcements" :key="ID">
            <collapsable-box
            :headline="`${dateLoader(announcement.savedOn)} || ${announcement.headline}`"
            :options="{
                body: announcement.content
            }"
            pathToComponentFromSrc='announcements/announcementBody'
            :tagDetails="tagLoader(announcement)"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'announcements',
    data() {
        return {
            announcements: null,
            tagTemplates: {
                important: {
                    words: 'Imporant',
                    symbol: '*',
                    color: 'important'
                },
                urgent: {
                    words: 'Urgent',
                    symbol: '!',
                    color: 'urgent'
                },
                new: {
                    words: 'New',
                    symbol: '^'
                }
            }
        }
    },
    methods: {
        tagLoader(announcement) {
            let tagArray = []
            if (announcement.important === 'true') {
                tagArray.push(this.tagTemplates.important)
            }
            if (announcement.urgent === 'true') {
                tagArray.push(this.tagTemplates.urgent)
            }
            return tagArray
        },
        dateLoader(stringDate) {
            const date = new Date(stringDate)
            const month = date.toLocaleString('default', {month: 'short'})
            const day = date.getDate()
            return `${month} ${day}`
        }
    },
    async created() {
        this.announcements = await this.$API.announcements()
    }
}
</script>

<style>

</style>
<template>
    <div>
        <msg-with-pic
            msg="There are currently no announcements"
            gif="twirlingPlane"
            title="Your administrator doesn't seem to be the talkative type..."
            v-if="!announcementsExists"
        />
        <div v-if="announcementsExists">
            <collapsable-box
                v-for="(announcement, ID) in announcements" 
                :key="ID"
                :headline="
                    `${dateLoader(announcement.savedOn)} || ${announcement.headline}`
                "
                :tagDetails="tagLoader(announcement)"
            >
                    <template
                        class="content" 
                        v-slot:content
                    >
                        {{ announcement.content }}
                    </template>
            </collapsable-box>
        </div>
    </div>
</template>

<script>
export default {
    name: 'announcements',
    data() {
        return {
            announcementsExists: true,
            announcements: null,
            lastVisit: this.$store.state.lastVisit
        }
    },
    methods: {
        tagLoader(announcement) {
            let tagArray = []
            if (announcement.important) tagArray.push('important')
            if (announcement.urgent) tagArray.push('urgent')
            if (this.isNew(announcement.savedOn)) tagArray.push('new')
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
        this.announcements = await this.$API.users.announcements()
        if (this.announcements.length < 1 || !this.announcements) this.announcementsExists = false
    }
}
</script>

<style>
.content {
    font-size: 1.7vh;
    text-align: left;
    padding-left: 2vw;
}
</style>
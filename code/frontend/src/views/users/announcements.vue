<template>
    <div>
        <msg-with-pic
            msg="There are currently no announcements"
            gif="twirlingPlane"
            title="Your administrator doesn't seem to be the talkative type..."
            v-if="!announcementsExists"
        />
        <user-announcements 
            @announcements="announcementsExists =  $event"
            v-show="announcementsExists"
        />
    </div>
</template>

<script>
import userAnnouncements from '@/components/announcements/user.vue'

export default {
    name: 'announcements',
    components: {
        userAnnouncements
    },
    data() {
        return {
            announcementsExists: true
        }
    }
}
</script>

<style>

</style>
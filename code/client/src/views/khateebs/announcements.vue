<template>
    <div>
        <div v-if="announcements.length > 0" class="announcements-container">
            <collapsable-box
                v-for="(announcement, index) in announcements"
                :key="index"
                class="announcement-container"
                :headline="headline(announcement)"
                :tagDetails="tagLoader(announcement)"
            >
                <div class="content" >
                    <p>{{ announcement.content }}</p>
                </div>
            </collapsable-box>
        </div>
        <msg-with-pic
            v-else
            msg="There are currently no announcements"
            gif="twirlingPlane"
            title="Your administrator doesn't seem to be the talkative type..."
        />
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'

import announcementHelpers from '@/libraries/announcements/main.js'

export default {
    name: 'announcements',
    components: {
        msgWithPic,
        collapsableBox
    },
    data() {
        return {
            announcements: []
        }
    },
    methods: {
        tagLoader(announcement) {
            return announcementHelpers.tagLoader(announcement, this.$store.state.user.lastLogin)
        },
        headline(announcement) {
            return announcementHelpers.headlineText(announcement)
        },
        async getAnnouncements() {
            try {
                const data = await this.$API.announcements.getAnnouncements()
                this.announcements = data || []
            } catch(err) {
                console.log(err)
            }
        }
    },
    created() {
        this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
.announcements-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 90%;
    max-height: 300px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    align-items: center;
    justify-content: center;
    max-height: 1500px;
}

.announcement-container {
    width: 45%;
}

.content {
    min-height: 50px;
    color: getColor("offWhite");
    text-align: left;
}

p {
    margin: 0;
    margin-left: 5px;
    font-size: 16px;
}

@media screen and (max-width: $phoneWidth) {
      .announcements-container {
            flex-direction: column;
        }
        .announcement-container {
            width: 100%;
        }
        p {
            margin: 0;
            margin-left: 2%;
            font-size: 2.3vh;
        }
}
</style>
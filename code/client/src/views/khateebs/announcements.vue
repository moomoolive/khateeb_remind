<template>
    <div>
        <msg-with-pic
            msg="There are currently no announcements"
            gif="twirlingPlane"
            title="Your administrator doesn't seem to be the talkative type..."
            v-if="!announcementsExists"
        />
        <div v-if="announcementsExists">
            <div 
                v-for="(twoAnnouncements, index) in announcementsArraysOfTwo"
                :key="index"
                class="two-announcement-container"
            >
                <collapsable-box
                    v-for="(announcement, ID) in twoAnnouncements" 
                    class="announcement-container"
                    :key="ID"
                    :headline="
                        `${_.dynamicDisplayDate(announcement.updatedAt)} || ${announcement.headline}`
                    "
                    :tagDetails="tagLoader(announcement)"
                >
                    <div class="content" >
                        <p>{{ announcement.content }}</p>
                    </div>
                </collapsable-box>
            </div>
        </div>
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: 'announcements',
    components: {
        msgWithPic
    },
    data() {
        return {
            announcementsExists: true,
            announcements: null,
            announcementsArraysOfTwo: null
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
            return date > this.$store.state.user.lastLogin
        },
        announcementsToArraysOfTwo(announcements) {
            const arraysOfTwo = []
            let chopped = []
            for (let i = 0; i < announcements.length; i++) {
                const copy = this._.deepCopy(announcements[i])
                chopped.push(copy)
                const even = i % 2
                if (even) {
                    arraysOfTwo.push(chopped)
                    chopped = []
                }
            }
            arraysOfTwo.push(chopped)
            return arraysOfTwo
        }
    },
    async created() {
        try{ 
            this.announcements = await this.$API.khateeb.getAnnouncements()
            if (this.announcements.length < 1) 
                this.announcementsExists = false
            else
                this.announcementsArraysOfTwo = this.announcementsToArraysOfTwo(this.announcements)
        } catch(err) {
            console.log(err)
            this.announcementsExists = false
        }
    }
}
</script>

<style lang="scss" scoped>
.two-announcement-container {
    display: flex;
    flex-direction: row;
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
      .two-announcement-container {
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
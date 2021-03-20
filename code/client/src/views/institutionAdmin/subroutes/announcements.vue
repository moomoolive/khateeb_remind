<template>
    <div>
        <div>
            <button 
                class="add-new-announcement-button blue"
                @click="openAddNewAnnouncementForm()"
            >
                +
            </button>
        </div>
        <general-popup-container
            v-if="showAddNewAnnouncementForm" 
            @close="closeAddNewAnnouncementForm()"
        >
            <div class="popup-form">
                <announcement-form-template
                    :formProps="{
                        buttonText: 'Create Announcement',
                        backgroundColor: 'yellow'
                    }" 
                    @submitted="submit($event)"
                />
            </div>
        </general-popup-container>
        <div v-if="showAnnouncements">
            <collapsable-box
                v-for="(announcement, index) in announcements"
                :key="index"
                class="announcement-container"
                :headline="headline(announcement)"
                :tagDetails="tagLoader(announcement)"
            >
                <button 
                    class="red"
                    @click="deleteAnnouncement(announcement._id, index)"
                >
                    Delete this Announcement
                </button>
                <announcement-form-template
                    :formProps="{
                        basedOn: announcement,
                        backgroundColor: 'none',
                        buttonText: 'Update'
                    }" 
                    @submitted="updateAnnouncement($event, index)"
                />
            </collapsable-box>
        </div>
    </div>
</template>

<script>
import announcementFormTemplate from '@/components/forms/templates/announcement.vue'
import generalPopupContainer from '@/components/notifications/generalPopup.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'

import announcementHelpers from '@/libraries/announcements/main.js'

export default {
    name: 'announcements',
    components: {
        generalPopupContainer,
        collapsableBox,
        announcementFormTemplate
    },
    data() {
        return {
            announcements: [],
            showAddNewAnnouncementForm: false,
            showAnnouncements: true 
        }
    },
    methods: {
        async submit($event) {
            try {
                const newAnnouncement = await this.$API.announcements.createNewAnnouncement($event)
                this.announcements.push(newAnnouncement)
                this.showAddNewAnnouncementForm = false
            } catch(err) {
                console.log(err)
            }
        },
        closeAddNewAnnouncementForm() {
            this.showAddNewAnnouncementForm = false
        },
        openAddNewAnnouncementForm() {
            this.showAddNewAnnouncementForm = true
        },
        tagLoader(announcement) {
            return announcementHelpers.tagLoader(announcement, this.$store.state.user.lastLogin)
        },
        headline(announcement) {
            return announcementHelpers.headlineText(announcement)
        },
        rerenderAnnouncements() {
            this.showAnnouncements = false
            this.$nextTick(() => this.showAnnouncements = true)
        },
        async updateAnnouncement($event, index) {
            try {
                const updated = await this.$API.announcements.updateAnnouncement($event)
                this.announcements.splice(index, 1, updated)
                this.rerenderAnnouncements()
            } catch(err) {
                console.log(err)
            }
        },
        async getAnnouncements() {
            try {
                this.announcements = await this.$API.announcements.getAnnouncements()
            } catch(err) {
                console.log(err)
            }
        },
        async deleteAnnouncement(id, index) {
            try {
                const confirm = await this.utils.confirm(`Are you sure you want to permenantly delete this announcement?`)
                if (!confirm)
                    return
                const res = await this.$API.announcements.deleteAnnouncement(id)
                console.log(res)
                this.announcements.splice(index, 1)
            } catch(err) {
                console.log(err)
            }
        },
    },
    created() {
        this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
select {
    border: none;
    outline: none;
    border-radius: 4px;
    height: 6vh;
    width: 80%;
    max-height: 50px;
    max-width: 510px;
    color: getColor("offWhite");
    font-size: 15px;
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}

.popup-form {
    width: 100%;
}

.announcement-container {
    width: 89%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}

button {
    width: 80%;
    max-width: 510px;
    height: 4vh;
    max-height: 35px;
    font-size: 16px;
}

.add-new-announcement-button {
    border-radius: 100px 100px 100px 100px;
    width: 60px;
    height: 35px;
    font-size: 22px;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@media screen and (max-width: $phoneWidth) {
      select {
          font-size: 1.8vh;
      }
      button {
          font-size: 2vh;
      }
}
</style>
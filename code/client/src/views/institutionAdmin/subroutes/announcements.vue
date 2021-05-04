<template>
    <div>
        
        <div>
            <button 
                class="add-new-announcement-button round dark-blue"
                @click="openAddNewAnnouncementForm()"
            >
                +
            </button>
        </div>

        <general-popup-container
            v-if="showAddNewAnnouncementForm"
            :closeOnClickAway="false" 
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
                v-for="(announcement, index) in announcements.filter(a => Object.keys(a).length > 0)"
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
                    @submitted="updateAnnouncement($event)"
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
import requestHelpers from '@/libraries/requests/helperLib/main.js'

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
        async submit(newAnnouncement={}) {
            const newlySavedAnnouncement = await this._api.announcements.createNewAnnouncement(newAnnouncement)
            this.announcements.push(newlySavedAnnouncement)
            this.showAddNewAnnouncementForm = false
        },
        closeAddNewAnnouncementForm() {
            this.showAddNewAnnouncementForm = false
        },
        openAddNewAnnouncementForm() {
            this.showAddNewAnnouncementForm = true
        },
        tagLoader(announcement) {
            return announcementHelpers.tagLoader(announcement, this.$store.state.user.userInfo.lastLogin)
        },
        headline(announcement) {
            return announcementHelpers.headlineText(announcement)
        },
        rerenderAnnouncements() {
            this.showAnnouncements = false
            this.$nextTick(() => this.showAnnouncements = true)
        },
        async updateAnnouncement($event) {
            const updated = await this._api.announcements.updateAnnouncement($event)
            const index = this.announcements.findIndex(a => a._id === updated._id)
            this.announcements.splice(index, 1, updated)
            this.rerenderAnnouncements()
        },
        async getAnnouncements() {
            this.announcements = await this._api.announcements.getAnnouncements()
        },
        async deleteAnnouncement(id, index) {
            const confirm = await this._utils.confirm(`Are you sure you want to permenantly delete this announcement?`)
            if (!confirm)
                return
            const res = await this._api.announcements.deleteAnnouncement(id)
            if (requestHelpers.dataWasDeleted(res))
                this.announcements.splice(index, 1)
        },
    },
    created() {
        this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
.popup-form {
    max-height: 305px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.announcement-container {
    width: 89%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
}

.add-new-announcement-button {
    margin-bottom: 40px;
    width: 60px;
    height: 35px;
    font-size: 22px;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@media screen and (max-width: $phone-width) {
      
    
}
</style>
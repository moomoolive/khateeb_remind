<template>
    <div>
        <loading :loadingTime="800">
            <div v-if="showSettings && settingsArePresent" class="settings-container">
                
                <collapsable-box
                    class="setting-container"
                    :headline="`Institution Details`"
                    :tagDetails="institution ? [{
                        words: `${institution.timezone} Timezone`,
                        color: 'goodNews',
                        symbol: '🌎' 
                    }] : null"
                    ref="institution-details"
                >
                    <institution-form-template 
                        :formProps="{
                            basedOn: institution,
                            bindedExts: ['states'],
                            backgroundColor: 'none',
                            buttonText: 'Update Institution'
                        }"
                        @submitted="saveInstitutionDetails($event)"
                    />
                </collapsable-box>

                <collapsable-box
                    class="setting-container"
                    :headline="`Institution Logo`"
                    :tagDetails="customLogoWasAdded ? null : [{
                        words: `No Logo`,
                        color: 'important',
                        symbol: '🖼️' 
                    }]"
                    ref="logo"
                >
                    <div class="insert-image-container">
                        <div class="image-info-caption">
                            <u>Your current logo:</u>
                        </div>
                        <img 
                            :src="institutionImageSrc"
                            class="institution-image-container" 
                            alt="institution image"
                        >
                        <div class="image-info-caption">
                            * Recommended size is 500px x 500px or above. <br>
                            * Equal height and width is recommended.
                        </div>
                        <input
                            class="image-input" 
                            type="file" 
                            accept="image/*"
                            name="logo"
                            @change="uploadInstitutionLogo($event)"
                        >
                        <div class="delete-logo-container">
                            <button 
                                :disabled="!customLogoWasAdded"
                                class="red delete-logo-button" 
                                @click="deleteLogo()"
                            >
                                Delete Logo
                            </button>
                        </div>
                    </div>
                </collapsable-box>

                <collapsable-box
                    class="setting-container"
                    :headline="`Registration`"
                    :tagDetails="institution && institution.settings ? [{
                        words: institution.settings.autoConfirmRegistration ? `Auto-Confirm` : `Manual-Confirm`,
                        color: 'default',
                        symbol: institution.settings.autoConfirmRegistration ? `🤖` : `📜`
                    }] : null"
                    ref="registration"
                >
                    <form-main
                        v-if="institution.settings" 
                        :structure="{
                            autoConfirmRegistration: {
                                type: 'checkbox',
                                required: true
                            },
                            allowJummahSignup: {
                                type: 'checkbox',
                                required: true
                            }
                        }"
                        :backgroundColor="`none`"
                        :basedOn="institution.settings"
                        @submitted="saveInstitutionDetails({ _id: institution._id, settings: $event })"
                    />
                </collapsable-box>

                <collapsable-box
                    class="setting-container"
                    :headline="`Notifications`"
                    :tagDetails="institution && institution.settings ? [{
                        words: institution.settings.allowJummahNotifications ? notificationTiming : `Off`,
                        color: institution.settings.allowJummahNotifications ? `goodNews` : `important`,
                        symbol: '✉️'
                    }] : null"
                    ref="chron-timing"
                >
                    <form-main
                        v-if="institution.settings" 
                        :structure="{
                            allowJummahNotifications: {
                                type: 'checkbox',
                                required: true
                            },
                            dayOfWeek: {
                                type: 'dropdown',
                                required: true,
                                selectOptions: [
                                    { text: 'Tuesday', num: 2 },
                                    { text: 'Wednesday', num: 3 },
                                    { text: 'Thursday', num: 4 },
                                ],
                                value: 'num',
                                display: 'text'
                            },
                            timing: {
                                type: 'timingMutator',
                                required: true,
                                textColor: 'white',
                                size: 'small'
                            }
                        }"
                        :backgroundColor="`none`"
                        :basedOn="notificationsSettings"
                        @submitted="saveInstitutionDetails({ 
                            _id: institution._id,
                            settings: {
                                allowJummahNotifications: $event.allowJummahNotifications,
                                jummahNotificationsTiming: { 
                                    hour: $event.timing.hour,
                                    minute: $event.timing.minute,
                                    dayOfWeek: $event.dayOfWeek
                                }
                            } 
                        })"
                    />
                </collapsable-box>

                <collapsable-box
                    v-if="_utils.validAuthentication(3)"
                    class="setting-container"
                    :headline="`Danger Zone`"
                    :buttonColor="`red`"
                    :bodyColor="`silver`"
                >
                    <button class="yellow delete-institution" @click="deleteInstitution()">
                        Delete Institution
                    </button>
                </collapsable-box>

            </div>

            <general-message
                v-else
                :message="`Couldn't retrieve settings...`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />
 
        </loading>
    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import institutionFormTemplate from '@/components/forms/templates/institution.vue'
import generalMessage from '@/components/misc/generalMessage.vue'
import loading from '@/components/general/loadingScreen.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'
import timingHelpers from '@/libraries/timings/main.js'

export default {
    name: "settings",
    components: {
        collapsableBox,
        formMain,
        institutionFormTemplate,
        generalMessage,
        loading
    },
    data() {
        return {
            institution: {},
            showSettings: true,
            institutionImageSrc: require('@/assets/logos/genericInstitution.png')
        }
    },
    methods: {
        uploadInstitutionLogo(fileChanges={}) {
            const targetFile = fileChanges.target.files[0]
            const reader = new FileReader()
            reader.onload = async (e) => {
                const base64Img = e.target.result.split("base64,")[1]
                const binaryString = window.atob(base64Img)
                const imageArray = []
                for (let i = 0; i < binaryString.length; i++)
                    imageArray.push(binaryString.charCodeAt(i))
                const resCode = await this._api.logos.saveInstitutionLogo({ img: imageArray })
                if (resCode === 0)
                    return this.institutionImageSrc = e.target.result
            }
            reader.readAsDataURL(targetFile)
        },
        async deleteLogo() {
            const confirm = await this._utils.confirm(`Are you sure you want to delete your logo?`)
            if (!confirm)
                return
            const resCode = await this._api.logos.deleteInstitutionLogo()
            if (resCode === 0)
                return this.institutionImageSrc =  require('@/assets/logos/genericInstitution.png')
        },
        async getInstitutionLogo() {
            this.institutionImageSrc = await this._api.logos.getInstitutionLogo(
                { institutionID: this.$store.state.user.institution._id }
            )
        },
        async getSettingsAndInstitutionInfo() {
            this.institution = await this._api.institutions.getInstitution()
        },
        async saveInstitutionDetails(newChanges={}) {
            const updated = await this._api.institutions.updateInstitution(newChanges)
            if (Object.keys(updated).length < 1)
                return
            this.institution = updated
            this.rerenderSettings()
        },
        async deleteInstitution() {
            const confirm = await this._utils.confirm(
                `Are you sure you want to delete your institution? All jummahs, khateebs, and institution admins will be deleted as well.`,
                "yellow",
                { hard: true, confirmationText: 'Delete My Institution' }
            )
            if (confirm) {
                const res = await this._api.institutions.deleteInstitution()
                if (!requestHelpers.dataWasDeleted(res))
                    return
                this._utils.alert(`You've successfully deleted your institution`, 'success')
                this.$store.dispatch('user/logout')
            }
        },
        rerenderSettings() {
            this.showSettings = false
            this.$nextTick(() => { this.showSettings = true })
        },
        openSettingsDropdown(ref="chronTiming") {
            const el = this.$refs[ref]
            if (el)
                el.$refs["open-dropdown"].click()
        }
    },
    computed: {
        settingsArePresent() {
            return Object.keys(this.institution).length > 0
        },
        notificationsSettings() {
            if (this.settingsArePresent)
                return { 
                    allowJummahNotifications: this.institution.settings.allowJummahNotifications,
                    dayOfWeek: this.institution.settings.jummahNotificationsTiming.dayOfWeek,
                    timing: {
                        minute: this.institution.settings.jummahNotificationsTiming.minute,
                        hour: this.institution.settings.jummahNotificationsTiming.hour 
                    }
                }
            else
                return {}
        },
        notificationTiming() {
            if (!this.settingsArePresent)
                return 'Wednesdays @ 6:00 AM'
            const date = timingHelpers.chronTiming(this.institution.settings.jummahNotificationsTiming)
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' })
            const time = date.toLocaleString('en-US', { minute: '2-digit', hour: 'numeric' })
            return `${dayOfWeek}s @ ${time}`
        },
        customLogoWasAdded() {
            return this.institutionImageSrc !== require('@/assets/logos/genericInstitution.png')
        },
    },
    mounted() {
        this.$nextTick(() => {
            const oneSecondInMilliseconds = 1_000
            window.setTimeout(() => {
                if (this.$route.query.click)
                    this.openSettingsDropdown(this.$route.query.click)
            }, oneSecondInMilliseconds)
        })
    },
    async created() {
        const milliseconds = 500
        window.setTimeout(() => this.getInstitutionLogo(), milliseconds)
        this.getSettingsAndInstitutionInfo()
    }
}
</script>

<style lang="scss" scoped>
.settings-container {
    display: flex;
    flex-direction: row;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: center;
    max-width: 1300px;
    flex-wrap: wrap;
}

.setting-container {
    width: 40%;
    max-height: 1500px;
    margin-top: 5px;
    margin-right: 5px;
    margin-left: 5px;
}

.delete-institution {
    width: 80%;
    height: 6vh;
    max-height: 60px;
    font-size: 20px;
    color: red;
}

.insert-image-container {
    padding-top: 20px;
    padding-bottom: 20px;
}

.institution-image-container {
    width: 80%;
    max-width: 275px;
}

.image-input {
    margin-top: 20px;
}

.image-info-caption {
    margin-top: 20px;
    text-align: left;
    width: 80%;
    @include centerMargin();
    font-size: 15px;
    color: getColor("offWhite");
    line-height: 25px;
}

.delete-logo-container {
    width: 80%;
    @include centerMargin();
    display: flex;
    justify-content: flex-start;
}

.delete-logo-button {
    @include floatingBoxShadow();
    font-size: 17px;
    margin-top: 30px;
}

@media screen and (max-width: $phoneWidth) {
    
    .settings-container {
        flex-direction: column;
        margin-bottom: 40px;
    }

    .setting-container {
        width: 100%;
        margin-right: 0px;
        margin-left: 0px;
    }

    .delete-institution {
        font-size: 3vh;
    }
    
    .image-info-caption {
        font-size: 13px;
    }

    .delete-logo-container {
        width: 85%;
    }

    .delete-logo-button {
        font-size: 14px;
    }
}
</style>
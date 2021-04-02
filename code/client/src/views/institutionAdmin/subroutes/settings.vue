<template>
    <div>
        <div v-if="showSettings && settingsArePresent" class="settings-container">
            
            <collapsable-box
                class="setting-container"
                :headline="`Institution Details`"
                :tagDetails="institution ? [{
                    words: `${institution.timezone} Timezone`,
                    color: 'goodNews',
                    symbol: '🌎' 
                }] : null"
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
                :headline="`Registration`"
                :tagDetails="institution && institution.settings ? [{
                    words: institution.settings.autoConfirmRegistration ? `Auto-Confirm` : `Manual-Confirm`,
                    color: 'default',
                    symbol: institution.settings.autoConfirmRegistration ? `🤖` : `📜`
                }] : null"
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
                v-if="utils.validAuthentication(3)"
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

        <msg-with-pic 
            v-else
            :msg="`Couldn't retrieve settings...`"
            :gif="`sadCatStanding`"
        /> 

    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import institutionFormTemplate from '@/components/forms/templates/institution.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'
import timingHelpers from '@/libraries/timings/main.js'

export default {
    name: "settings",
    components: {
        collapsableBox,
        formMain,
        institutionFormTemplate,
        msgWithPic
    },
    data() {
        return {
            institution: {},
            showSettings: true
        }
    },
    methods: {
        async getSettingsAndInstitutionInfo() {
            this.institution = await this.$API.institutions.getInstitution()
        },
        async saveInstitutionDetails(newChanges={}) {
            const updated = await this.$API.institutions.updateInstitution(newChanges)
            if (Object.keys(updated).length < 1)
                return
            this.institution = updated
            this.rerenderSettings()
        },
        async deleteInstitution() {
            const confirm = await this.utils.confirm(`Are you sure you want to delete your institution? All jummahs, khateebs, and institution admins will be deleted as well.`)
            if (confirm) {
                const res = await this.$API.institutions.deleteInstitution()
                if (!requestHelpers.dataWasDeleted(res))
                    return
                this.utils.alert(`You've successfully deleted your institution`, 'success')
                this.$router.push('/')
                this.$store.dispatch('logout')
            }
        },
        rerenderSettings() {
            this.showSettings = false
            this.$nextTick(() => { this.showSettings = true })
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
        }
    },
    async created() {
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
}

.delete-institution {
    width: 80%;
    height: 6vh;
    max-height: 60px;
    font-size: 20px;
    color: red;
}

@media screen and (max-width: $phoneWidth) {
    
    .settings-container {
        flex-direction: column;
    }

    .setting-container {
        width: 100%;
    }

    .delete-institution {
        font-size: 3vh;
    }
}
</style>
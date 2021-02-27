<template>
    <div>
        <div class="two-settings-container">
            <collapsable-box
                class="setting-container"
                :headline="`Institution Details`"
                :tagDetails="institution ? [{
                    words: `${institution.timezone} Timezone`,
                    color: 'goodNews',
                    symbol: '🌎' 
                }] : null"
            >
                <institution-details 
                    v-if="institution"
                    :institution="institution"
                    @submitted="saveInstitutionDetails($event)"
                />
            </collapsable-box>
        </div>
        <div class="two-settings-container">
            <collapsable-box
                class="setting-container"
                :headline="`Text Settings`"
                :tagDetails="settings ? [{
                    words: settings.textAllowed ? `Online` : `Offline`,
                    color: settings.textAllowed ? `goodNews` : `urgent`,
                    symbol: settings.textAllowed ? `✔️` : `⚠️`
                }] : null"
            >
                <text-settings
                    v-if="settings"
                    :settings="settings" 
                    @submitted="saveSettings($event)"
                />
            </collapsable-box>
            <collapsable-box
                class="setting-container"
                :headline="`Registration Settings`"
                :tagDetails="settings ? [{
                    words: settings.autoConfirmRegistration ? `Auto-Confirm` : `Manual-Confirm`,
                    color: 'default',
                    symbol: settings.autoConfirmRegistration ? `🤖` : `📜`
                }] : null"
            >
                <registration-settings
                    v-if="settings" 
                    :settings="{
                        autoConfirmRegistration: settings.autoConfirmRegistration,
                        _id: settings._id
                    }"
                    @submitted="saveSettings($event)"
                />
            </collapsable-box>
        </div>
        <div class="two-settings-container" v-if="_.validAuthentication(3)">
            <collapsable-box
                class="setting-container"
                :headline="`Danger Zone`"
                :buttonColor="`red`"
                :bodyColor="`silver`"
            >
                <button class="yellow delete-institution" @click="deleteInstitution()">Delete Institution</button>
            </collapsable-box>
        </div>
    </div>
</template>

<script>
import textSettings from './subviews/textSettings.vue'
import institutionDetails from './subviews/institutionDetails.vue'
import registrationSettings from './subviews/registrationSettings'
import collapsableBox from '@/components/general/collapsableBox.vue'

export default {
    name: "settings",
    components: {
        textSettings,
        institutionDetails,
        registrationSettings,
        collapsableBox
    },
    data() {
        return {
            institution: null,
            settings: null
        }
    },
    methods: {
        async getInstitutionDetails() {
            try {
                this.institution = await this.$API.institutionAdmin.getInstitution()
            } catch(err) {
                console.log(err)
            }
        },
        async getAllSettings() {
            try {
                this.settings = await this.$API.institutionAdmin.getSettings()
            } catch(err) {
                console.log(err)
            }
        },
        async saveSettings($event) {
            try {
                this.settings = await this.$API.institutionAdmin.updateSettings($event)
                this.$store.commit('admin/showSavedChangesScreen')
            } catch(err) {
                console.log(err)
            }
        },
        async saveInstitutionDetails($event) {
            try {
                this.institution = await this.$API.institutionAdmin.updateInstitution($event)
                this.$store.commit('admin/showSavedChangesScreen')
            } catch(err) {
                console.log(err)
            }
        },
        async deleteInstitution() {
            const confirm = await this._.confirm(`Are you sure you want to delete your institution? All jummahs, khateebs, and institution admins will be deleted as well.`)
            if (confirm) {
                try {
                    const res = await this.$API.rootInstitutionAdmin.deleteInstitution()
                    console.log(res)
                    this._.alert(`You've successfully deleted your institution`, 'success')
                    this.$router.push('/')
                    this.$store.dispatch('logout')
                } catch(err) {
                    console.log(err)
                }
            }
        }
    },
    created() {
        this.getInstitutionDetails()
        this.getAllSettings()
    }
}
</script>

<style lang="scss" scoped>
.two-settings-container {
    display: flex;
    flex-direction: row;
    width: 90%;
    max-height: 300px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    max-height: 1500px;
    height: auto;
    align-items: center;
    justify-content: center;
}

.setting-container {
    width: 45%;
}

.delete-institution {
    width: 80%;
    height: 6vh;
    max-height: 60px;
    font-size: 20px;
    color: red;
}

@media screen and (max-width: $phoneWidth) {
      .two-settings-container {
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
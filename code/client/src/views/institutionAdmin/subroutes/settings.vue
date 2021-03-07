<template>
    <div v-if="showSettings">
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
                <institution-form-template 
                    v-if="institution"
                    :formProps="{
                        basedOn: institution,
                        bindedExts: ['states'],
                        backgroundColor: 'none',
                        buttonText: 'Update Institution'
                    }"
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
                <img class="text-vendor-logo" src="~@/assets/logos/twillio.png">
                <form-main
                    v-if="settings" 
                    :structure="{
                        textAllowed: {
                            type: 'checkbox',
                            required: true
                        },
                        twilioUser: {
                            required: true,
                            tag: 'encrypted'
                        },
                        twilioKey: {
                            type: 'protected',
                            toggle: true,
                            required: true,
                            tag: 'encrypted'
                        },
                        twilioPhoneNumber: {
                            required: true,
                            minLength: 12
                        },
                    }"
                    :backgroundColor="`none`"
                    :basedOn="settings"
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
                <form-main
                    v-if="settings" 
                    :structure="{
                        autoConfirmRegistration: {
                            type: 'checkbox',
                            required: true
                        }
                    }"
                    :backgroundColor="`none`"
                    :basedOn="settings"
                    @submitted="saveSettings($event)"
                />
            </collapsable-box>
        </div>
        <div class="two-settings-container" v-if="utils.validAuthentication(3)">
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
import collapsableBox from '@/components/general/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import institutionFormTemplate from '@/components/forms/templates/institution.vue'

export default {
    name: "settings",
    components: {
        collapsableBox,
        formMain,
        institutionFormTemplate
    },
    data() {
        return {
            institution: null,
            settings: null,
            showSettings: true
        }
    },
    methods: {
        async getSettingsAndInstitutionInfo() {
            try {
                const [settings, institution] = await Promise.all([
                    this.$API.settings.getSettings(),
                    this.$API.institutions.getInstitution()
                ])
                this.settings = settings
                this.institution = institution
            } catch(err) {
                console.log(err)
            }
        },
        async saveSettings($event) {
            try {
                const updatedSettings = await this.$API.settings.updateSettings($event)
                this.settings = updatedSettings || this.settings
                this.rerenderSettings()
            } catch(err) {
                console.log(err)
            }
        },
        async saveInstitutionDetails($event) {
            try {
                const updatedInstitution = await this.$API.institutions.updateInstitution($event)
                this.institution = updatedInstitution || this.institution
                this.rerenderSettings()
            } catch(err) {
                console.log(err)
            }
        },
        async deleteInstitution() {
            const confirm = await this.utils.confirm(`Are you sure you want to delete your institution? All jummahs, khateebs, and institution admins will be deleted as well.`)
            if (confirm) {
                try {
                    await this.$API.institutions.deleteInstitution()
                    this.utils.alert(`You've successfully deleted your institution`, 'success')
                    this.$router.push('/')
                    this.$store.dispatch('logout')
                } catch(err) {
                    console.log(err)
                }
            }
        },
        rerenderSettings() {
            this.showSettings = false
            this.$nextTick(() => { this.showSettings = true })
        }
    },
    async created() {
        this.getSettingsAndInstitutionInfo()
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

.text-vendor-logo {
    width: 80%;
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
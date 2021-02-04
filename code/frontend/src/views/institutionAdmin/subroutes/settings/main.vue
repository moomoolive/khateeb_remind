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
            <collapsable-box
                class="setting-container"
                :headline="`Prayer Locations & Timings`"
            >
                <locations-and-timings
                    v-if="locations && timings"
                    :locations="locations"
                    :timings="timings"
                    @new-location="newLocation($event)"
                    @delete="deleteInfo($event)"
                    @submitted="saveLocationsAndTimings($event)" 
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
        <div class="two-settings-container" v-if="_.authRequirementsSatisfied(3)">
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
import staticTags from './tags.json'
import locationsAndTimings from './subviews/locationsAndTimings.vue' 
import textSettings from './subviews/textSettings.vue'
import institutionDetails from './subviews/institutionDetails.vue'
import registrationSettings from './subviews/registrationSettings'

export default {
    name: "settings",
    components: {
        locationsAndTimings,
        textSettings,
        institutionDetails,
        registrationSettings
    },
    data() {
        return {
            staticTags,
            locations: null,
            timings: null,
            institution: null,
            settings: null
        }
    },
    methods: {
        async getLocationsAndTimings() {
            try {
                this.locations = await this.$API.institutionAdmin.getLocations('all')
                this.timings = await this.$API.institutionAdmin.getTimings('all', 'all')
            } catch(err) {
                console.log(err)
            }
        },
        async getInstitutionDetails() {
            try {
                this.institution = await this.$API.institutionAdmin.getInstitution()
            } catch(err) {
                console.log(err)
            }
        },
        async saveLocationsAndTimings($event) {
            try {
                const locations = await this.$API.institutionAdmin.saveLocations({ locations: $event.locations })
                $event.times.forEach(time => {
                    if (time.new) {
                        delete time.new
                        delete time._id
                    }
                })
                const timings = await this.$API.institutionAdmin.saveTimings({ times: $event.times })
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async newLocation($event) {
            try {
                const newest = await this.$API.institutionAdmin.saveLocations({ locations: $event, new: true })
                this.getLocationsAndTimings()
            } catch(err) {
                console.log(err)
            }
        },
        async deleteInfo($event) {
            try {
                if ($event.type === 'location') {
                     const deleted = await this.$API.institutionAdmin.deleteLocation({ _id: $event.id })
                }
                else {
                    const deleted = await this.$API.institutionAdmin.deleteTiming({ _id: $event.id })
                }
                this.$store.dispatch('adminSavedChangesScreen', true)
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
                const saved = await this.$API.institutionAdmin.updateSettings($event)
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async saveInstitutionDetails($event) {
            try {
                const saved = await this.$API.institutionAdmin.updateInstitution($event)
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async deleteInstitution() {
            const confirm = await this._.confirm(`Are you sure you want to delete your institution? All jummahs, khateebs, and institution admins will be deleted as well.`)
            if (confirm) {
                try {
                    const deleted = await this.$API.rootInstitutionAdmin.deleteInstitution({ _id: "rootAdmin" })
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
        this.getLocationsAndTimings()
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
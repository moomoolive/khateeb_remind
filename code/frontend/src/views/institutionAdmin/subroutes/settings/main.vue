<template>
    <div>
        <div class="two-settings-container">
            <collapsable-box
                class="setting-container"
                :headline="`Institution Details`"
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
            >
                <registration-settings
                    v-if="settings" 
                    :settings="{
                        autoConfirmKhateebs: settings.autoConfirmKhateebs,
                        _id: settings._id
                    }"
                    @submitted="saveSettings($event)"
                />
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
                console.log($event)
                const locations = await this.$API.institutionAdmin.saveLocations({ locations: $event.locations })
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
        }
    },
    computed: {

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

@media screen and (max-width: $phoneWidth) {
      .two-settings-container {
            flex-direction: column;
        }
    .setting-container {
        width: 100%;
    }
}
</style>
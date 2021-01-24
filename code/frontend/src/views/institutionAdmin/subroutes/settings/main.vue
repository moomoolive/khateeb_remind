<template>
    <div>
        <collapsable-box
            :headline="`Prayer Locations & Timings`"
            :tagDetails="locationTimingTag"
        >
            <location-timing
                v-if="locationAndTimingsData"
                :emptySchema="locationAndTimingsData.emptySchema"
                :previousEntries="locationAndTimingsData.previousEntries"
                @submitted="saveSetting($event)"
            />
        </collapsable-box>
        <collapsable-box
            :headline="`Admin Details`"
            :tagDetails="adminDetailsTag"
        >
            <admin-details
                v-if="adminIdentityData && timezoneData"
                :adminIdentityData="adminIdentityData"
                :timezoneData="timezoneData"
                :supportedTimezones="supportedTimezones"
                :adminDetailTags="staticTags.adminDetails"
                :sharedTags="staticTags.shared"
                @submitted="saveSetting($event)"
            />
        </collapsable-box>
        <collapsable-box
            :headline="`Text Service`"
            :tagDetails="textServiceTag"
        >
            <text-service
                v-if="textPhoneData && textAPIData"
                :textInfoUnavailable="textInfoUnavailable"
                :verificationTextSent="verificationTextSent"
                :textPhoneData="textPhoneData"
                :textAPIData="textAPIData"
                :sharedTags="staticTags.shared"
                @submitted="saveSetting($event)"
                @verification-text="sendVerificationText()"
            />
        </collapsable-box>
    </div>
</template>

<script>
import adminDetails from './subviews/adminDetails.vue'
import locationTiming from './subviews/locationTiming.vue'
import textService from './subviews/textService.vue'
import staticTags from './tags.json' 

export default {
    name: "settings",
    components: {
        adminDetails,
        locationTiming,
        textService
    },
    data() {
        return {
            locationAndTimingsData: null,
            adminIdentityData: null,
            textPhoneData: null,
            textAPIData: null,
            timezoneData: null,
            supportedTimezones: null,
            staticTags,
            tags: staticTags.main,
            verificationTextSent: false
        }
    },
    methods: {
        getSettingData(settingName) {
            return this.$API.admin.getSetting(settingName)
        },
        async saveSetting($event) {
            const res = await this.$API.admin.updateSetting($event)
            if (res === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
        previousEntriesExist(dataName) {
            return !this[dataName] || !!this[dataName].previousEntries[0]
        },
        async sendVerificationText() {
            const res = await this.$API.misc.checkTextService()
            if (res === 'text was sent') {
                this.verificationTextSent = true
            } else alert('There is a problem with the text service')
        },
        async assignAPIData(settingName, targetVal='default') {
            try {
                const apiData = await this.getSettingData(settingName)
                const target = targetVal === 'default' ? settingName + 'Data' : targetVal
                this[target] = apiData
            } catch(err) {
                this.apiCallError(settingName, err)
            }
        },
        apiCallError(dataName, error) {
            alert(
                `Khateeb remind couldn't retrieve ${dataName} from API
                
                Error Reference:
                ${error}`
            )
            console.log(error)
        },
        compileTags(tagCategory, missingFields) {
            const tags = []
            missingFields.forEach(field => {
                if (!this.previousEntriesExist(field)) {
                    tags.push(this.tags[tagCategory][field])
                }
            })
            return tags
        },
        errorTagRequired(missingFields=[]) {
            if (missingFields.length < 1)
                return null
            let isRequired = false
            missingFields.forEach(field => {
                if (!this.previousEntriesExist(field))
                    isRequired = true
            })
            return isRequired
        },
        errorTagKeys(tagCategory) {
            const keys = Object.keys(this.tags[tagCategory])
            return keys.filter(elem => elem.slice(-4) === 'Data')
        },
        async getSupportedTimezones() {
            try {
                this.supportedTimezones = await this.$API.misc.getTimeZones()
            } catch(err) {
                this.apiCallError('timezones', err)
            }
        }
    },
    computed: {
        locationTimingTag() {
            if (this.previousEntriesExist('locationAndTimingsData')) {
                return null
            } return [this.tags.locationTiming]
        },
        adminDetailsTag() {
            const tagCategory = 'adminDetails'
            const errorKeys = this.errorTagKeys(tagCategory)
            if (this.errorTagRequired(errorKeys))
                return this.compileTags(tagCategory, errorKeys)
            else return null
        },
        textInfoUnavailable() {
            return this.errorTagRequired(this.errorTagKeys('textService'))
        },
        textServiceTag() {
            const tagCategory = 'textService'
            if (this.textInfoUnavailable) {
                return this.compileTags(tagCategory, this.errorTagKeys(tagCategory))
            } else return [this.tags[tagCategory].online] 
        }
    },
    created() {
        this.assignAPIData('locationAndTimings')
        this.assignAPIData('adminProfile', 'adminIdentityData')
        this.assignAPIData('textPhone')
        this.assignAPIData('textAPI')
        this.assignAPIData('timezone')
        this.getSupportedTimezones()
    }

}
</script>

<style lang="scss" scoped>

</style>
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
                v-if="adminIdentityData"
                :adminIdentityData="adminIdentityData"
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
            tags: {
                locationTiming: {
                    words: 'No Locations or Timings on File',
                    symbol: '⚠️',
                    color: 'urgent'
                },
                adminDetails: {
                    words: 'No Administrator on File',
                    symbol: '⚠️',
                    color: 'urgent'
                },
                textService: {
                    online: {
                        words: 'Online',
                        symbol: '😄',
                        color: 'goodNews'
                    },
                    missingInfo: {
                        words: 'No Admin Number',
                        symbol: '😔',
                        color: 'important'
                    },
                    noTwillioPhone: {
                        words: 'No Twillio Phone',
                        symbol: '⚠️',
                        color: 'urgent'
                    },
                    noTwillioAPI: {
                        words: 'Twillio API Info Missing',
                        symbol: '🛑',
                        color: 'important'
                    }
                }
            },
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
            const apiData = await this.getSettingData(settingName)
            const target = targetVal === 'default' ? settingName + 'Data' : targetVal
            this[target] = apiData
        }
    },
    computed: {
        locationTimingTag() {
            if (this.previousEntriesExist('locationAndTimingsData')) {
                return null
            } return [this.tags.locationTiming]
        },
        adminDetailsTag() {
            if (this.previousEntriesExist('adminIdentityData')) {
                return null
            } return [this.tags.adminDetails]
        },
        textInfoUnavailable() {
            return (
                !this.previousEntriesExist('adminIdentityData') ||
                !this.previousEntriesExist('textPhoneData') ||
                !this.previousEntriesExist('textAPIData')
            )
        },
        textServiceTag() {
            if (this.textInfoUnavailable) {
                const tags = []
                if (!this.previousEntriesExist('adminIdentityData'))
                    tags.push(this.tags.textService.missingInfo) 
                if (!this.previousEntriesExist('textPhoneData')) 
                    tags.push(this.tags.textService.noTwillioPhone)
                if (!this.previousEntriesExist('textAPIData'))
                    tags.push(this.tags.textService.noTwillioAPI)
                return tags
            } else return [this.tags.textService.online] 
        }
    },
    created() {
        this.assignAPIData('locationAndTimings')
        this.assignAPIData('adminProfile', 'adminIdentityData')
        this.assignAPIData('textPhone')
        this.assignAPIData('textAPI')
    }

}
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <collapsable-box
            :headline="`Prayer Locations & Timings`"
            :tagDetails="locationTimingTag"
        >
            <location-timing
                v-if="locationAndTimingData"
                :emptySchema="locationAndTimingData.emptySchema"
                :previousEntries="locationAndTimingData.previousEntries"
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
                v-if="textPhoneData"
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
            locationAndTimingData: null,
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
        }
    },
    computed: {
        locationTimingTag() {
            if (this.previousEntriesExist('locationAndTimingData')) {
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
    async created() {
        this.locationAndTimingData = await this.getSettingData('locationAndTimings')
        this.adminIdentityData = await this.getSettingData('adminProfile')
        this.textPhoneData = await this.getSettingData('textPhone')
        this.textAPIData = await this.getSettingData('textAPI')
    }

}
</script>

<style lang="scss" scoped>

</style>
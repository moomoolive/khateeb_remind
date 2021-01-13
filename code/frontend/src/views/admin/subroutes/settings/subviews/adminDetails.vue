<template>
    <div>
        <h2 v-if="adminIdentityNotFilled">
            Please fill in admin identity form to access text
            service
        </h2>
        <collapsable-box
            :headline="`Admin Identity`"
            :tagDetails="adminIdentityTag"
        >
            <settings-form
                :name="`admin profile`"
                :invalidations="adminIdentity.invalidations"
                :backgroundColor="`yellow-green`"
                :emptySchema="adminIdentityData.emptySchema"
                :previousEntries="adminIdentityData.previousEntries"
                @submitted="$emit('submitted', $event)"
            />
        </collapsable-box>
        <collapsable-box
            :headline="`Timezone`"
            :tagDetails="timezoneTag"
        >
            <settings-form
                :name="`updated password`"
                :backgroundColor="`red-green`"
                :emptySchema="timezoneData.emptySchema"
                :previousEntries="timezoneData.previousEntries"
                :dropdown="{ 
                    name: {
                        namingConvention: timezoneDisplay,
                        data: supportedTimezones
                    } 
                }"
                :inputAlias="{ name: 'choose your timezone' }"
                @submitted="$emit('submitted', $event)"
            />
        </collapsable-box>
        <collapsable-box
            :headline="`Update Password`"
        >
            <settings-form
                :name="`updated password`"
                :invalidations="updatePassword.invalidations"
                :backgroundColor="`blue-green`"
                :emptySchema="updatePassword.emptySchema"
                @submitted="preprocessPassword($event)"
            />
        </collapsable-box>
    </div>
</template>

<script>
import settingsForm from '@/components/forms/templates/settings.vue'

export default {
    name: 'adminDetails',
    components: {
        settingsForm
    },
    props: {
        adminIdentityData: {
            type: Object,
            required: true
        },
        timezoneData: {
            type: Object,
            required: true
        },
        supportedTimezones: {
            type: Array,
            required: true
        },
        sharedTags: {
            type: Object,
            required: true
        },
        adminDetailTags: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            adminIdentityNotFilled: !this.adminIdentityData.previousEntries[0],
            adminIdentity: {
                invalidations: {
                    emptyField: ['firstName', 'lastName']
                },
            },
            updatePassword: {
                invalidations: {
                    invalidPassword: ['createNewPassword'],
                    notEqual: {
                        confirmNewPassword: 'createNewPassword'
                    }
                },
                emptySchema: {
                    __t: 'password',
                    options: {
                        confirmOldPassword: '',
                        createNewPassword: '',
                        confirmNewPassword: ''
                    }
                }
            }
        }
    },
    methods: {
        preprocessPassword($event) {
            const data = this._.deepCopy($event)
            data.confirm = data.options.confirmOldPassword
            data.options = data.options.createNewPassword
            this.toAPI(data)
        },
        toAPI(data) {
            this.$emit('submitted', data)
        },
        timezoneDisplay(timezone) {
            const parsed = this._.stringFormat(timezone, 'camel', 'title', true)
            let timezoneAbbreviated = parsed.filter(word => word.length === 1)
            timezoneAbbreviated = timezoneAbbreviated.reduce((total, letter) => total + letter)
            const lengthOfTimezoneAbbreviated = 3
            for (let i = 0; i < lengthOfTimezoneAbbreviated; i++) { parsed.pop() }
            const TZ = parsed.reduce((total, elem) => `${total}/${elem}`) + ` - ${timezoneAbbreviated}`
            return TZ
        }
    },
    computed: {
        adminIdentityTag() {
            if (!this.adminIdentityData.previousEntries[0]) return [this.sharedTags.attention]
            else return null
        },
        timezoneTag() {
            if (!this.timezoneData.previousEntries[0]) return [this.adminDetailTags.defaultTZ]
            else return [{
                words: this.timezoneDisplay(this.timezoneData.previousEntries[0].options.name),
                symbol: '🌎',
                color: 'goodNews'
            }]
        }
    }
}
</script>

<style>

</style>
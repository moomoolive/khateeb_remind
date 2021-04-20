<template>
    <div>
        <loading>
            <div v-if="settingInfoReady">
                <form-main
                    :structure="{
                        autoConfirmRegistration: {
                            type: 'checkbox',
                            required: true
                        },
                        textAllowed: {
                            type: 'checkbox',
                            required: true
                        },
                        accountSid: {
                            required: true,
                            minLength: 1
                        },
                        accountAuthToken: {
                            required: true,
                            minLength: 1
                        },
                        phoneNumber: {
                            required: true,
                            minLength: 12
                        },
                    }"
                    :basedOn="formInput"
                    :backgroundColor="`darkBlue`"
                    @submitted="saveRootSettings($event)"
                />
            </div>

            <msg-with-pic 
                v-else
                :msg="`Couldn't retrieve institution settings`"
                :gif="`twirlingPlane`"
            />
        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'
import formMain from '@/components/forms/main.vue'

export default {
    name: "rootInstitutionSettings",
    components: {
        loading,
        msgWithPic,
        formMain
    },
    data() {
        return {
            institution: {}
        }
    },
    methods: {
        async getRootInstitution() {
            const res = await this.$API.sysAdmin.getInstitutions({ name: "__ROOT__" })
            this.institution = res[0] || {}
        },
        async saveRootSettings(updates={}) {
            const settings = {
                ...updates,
                textAPIInfo: {
                    accountSid: updates.accountSid,
                    accountAuthToken: updates.accountAuthToken,
                    phoneNumber: updates.phoneNumber,
                    textAllowed: updates.textAllowed
                }
            }
            console.log(settings)
            const res = await this.$API.sysAdmin.updateInstitution({ institutionID: this.institution._id, settings })
            if (Object.keys(res).length > 0)
                return this.utils.alert(`Successfully updated`, 'success')
            else
                return this.utils.alert(`Couldn't update`)
        }
    },
    computed: {
        settingInfoReady() {
            return Object.keys(this.institution).length > 0
        },
        formInput() {
            if (this.settingInfoReady)
                return {
                    autoConfirmRegistration: this.institution.settings.autoConfirmRegistration,
                    // these three fields are required to use the twilio API
                    // which is the current text API that khateeb Remind uses
                    accountSid: this.institution.settings.textAPIInfo.accountSid || 'ACnone',
                    accountAuthToken: this.institution.settings.textAPIInfo.accountAuthToken || 'token',
                    phoneNumber: this.institution.settings.textAPIInfo.phoneNumber || '+11000000000',
                    textAllowed: this.institution.settings.textAPIInfo.textAllowed === undefined ?
                        false : this.institution.settings.textAPIInfo.textAllowed,
                }
            else
                return {}
        }
    },
    created() {
        this.getRootInstitution()
    }
}
</script>

<style lang="scss" scoped>

</style>
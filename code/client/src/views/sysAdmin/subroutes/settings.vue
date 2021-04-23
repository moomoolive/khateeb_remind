<template>
    <div>
        <loading>
            <div v-if="settingInfoReady">
                <form-main
                    :structure="{
                        autoConfirmRegistration: {
                            type: 'checkbox',
                            required: true
                        }
                    }"
                    :basedOn="institution.settings"
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
            const res = await this.$API.sysAdmin.updateInstitution({ 
                institutionID: this.institution._id, 
                settings: updates 
            })
            if (Object.keys(res).length > 0)
                return this.utils.alert(`Successfully updated`, 'success')
            else
                return this.utils.alert(`Couldn't update`)
        }
    },
    computed: {
        settingInfoReady() {
            return Object.keys(this.institution).length > 0
        }
    },
    created() {
        this.getRootInstitution()
    }
}
</script>

<style lang="scss" scoped>

</style>
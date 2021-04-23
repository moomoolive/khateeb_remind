<template>
    <div>
        <loading>
            <div v-if="$store.state.user.userInfo.systemSettings && showForm">
                <form-main
                    :structure="{
                        autoConfirmRegistration: {
                            type: 'checkbox',
                            required: true
                        }
                    }"
                    :basedOn="$store.state.user.userInfo.systemSettings"
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
            showForm: true
        }
    },
    methods: {
        async saveRootSettings(updates={}) {
            const res = await this.$API.user.updateInfo({ systemSettings: updates })
            if (res.data) {
                this.utils.alert(`Successfully updated`, 'success')
                return this.rerenderForm()
            }
            else
                return this.utils.alert(`Couldn't update`)
        },
        rerenderForm() {
            this.showForm = false
            this.$nextTick(() => this.showForm = true)
        }
    },
}
</script>

<style lang="scss" scoped>

</style>
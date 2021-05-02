<template>
    <div>
        <loading>
            <div v-if="$store.state.user.userInfo.systemSettings && showForm">
                <form-main
                    :structure="{
                        autoConfirmInstitutionRegistration: {
                            type: 'checkbox',
                            required: true
                        },
                        autoConfirmUserRegistration: {
                            type: 'checkbox',
                            required: true
                        }
                    }"
                    :basedOn="$store.state.user.userInfo.systemSettings"
                    :backgroundColor="`darkBlue`"
                    @submitted="saveRootSettings($event)"
                />
            </div>

            <general-message
                v-else
                :message="`Couldn't retrieve institution settings`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'
import formMain from '@/components/forms/main.vue'

export default {
    name: "rootInstitutionSettings",
    components: {
        loading,
        generalMessage,
        formMain
    },
    data() {
        return {
            showForm: true
        }
    },
    methods: {
        async saveRootSettings(updates={}) {
            const res = await this._api.user.updateInfo({ systemSettings: updates })
            if (res.data) {
                this._utils.alert(`Successfully updated`, 'success')
                return this.rerenderForm()
            }
            else
                return this._utils.alert(`Couldn't update`)
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
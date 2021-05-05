<template>
    <div v-if="showProfileSettings">
        
        <collapsable-box
            class="user-setting"
            :headline="`Change Username`"
        >
            <form-main 
                :structure="{
                    username: {
                        required: true,
                        validators: 'username'
                    }
                }"
                :backgroundColor="`none`"
                :basedOn="{ username: $store.state.user.userInfo.username }"
                :buttonText="`Change Username`"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        
        <collapsable-box
            class="user-setting"
            :headline="`Change Password`"
        >
            <form-main
                :structure="{
                    password: {
                        required: true,
                        minLength: 6
                    }
                }"
                :bindedExts="['confirms']"
                :backgroundColor="`none`"
                :buttonText="`Change Password`"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        
        <collapsable-box
            class="user-setting"
            :headline="`Profile Details`"
        >
            <user-form-template 
                :userType="$store.getters['user/type']"
                :formProps="{
                    backgroundColor: 'none',
                    buttonText: 'Update Profile',
                    basedOn: $store.state.user.userInfo
                }"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        
        <collapsable-box
            v-if="$store.getters['user/authLevel'] !== 4"
            class="user-setting"
            :headline="`Danger Zone`"
            :buttonColor="`red`"
            :bodyColor="`silver`"
        >
            <button class="yellow delete-account" @click="deleteAccount()">Delete My Account</button>
        </collapsable-box>

    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'

export default {
    name: 'userHome',
    components: {
        collapsableBox,
        formMain,
        userFormTemplate
    },
    data() {
        return {
            showProfileSettings: true,
        }
    },
    methods: {
        async updateInfo(update={}) {
            const res = await this._api.user.updateInfo(update)
            if (!res.data)
                return this._utils.alert(`There was a problem updating your profile`)
            this.rerenderProfileSettings()
            this._utils.alert(`Successfully updated`, 'success')
        },
        rerenderProfileSettings() {
            this.showProfileSettings = false
            this.$nextTick(() => { this.showProfileSettings = true })
        },
        async alertUserAboutConficts() {
            const confirm = await this._utils.confirm(
                `It appears that you're a root adminstrator at one or more institutions. Before you can successfully delete your account you must remove your root adminstrator permissions at each relavent institutions. Would you like to be redirected to the permissions page?`
            )
            if (!confirm) {
                return
            } else if (!this.$store.getters['user/isLoggedInAsGenericUser']) {
                await this.$store.dispatch('user/downgradeUserAuthorization')
            } else {
                return this._utils.toHomePage()
            }
        },
        async deleteAccount() {
            if (this.$store.state.user.isRootAdminAtOneInstitution) {
                return this.alertUserAboutConficts()
            }
            const confirm = await this._utils.confirm(
                `Are you sure you want to permenantly delete your account?`,
                "yellow",
                { hard: true, confirmationText: "Delete My Account" }
            )
            if (!confirm)
                return
            const res = await this._api.user.deleteAccount()
            if (!requestHelpers.dataWasDeleted(res))
                return
            this.$store.dispatch('user/logout')
            this._utils.alert(`Successfully deleted account`, 'success')
        },
    },
    computed: {
        
    },
    created() {
        
    }
}
</script>

<style lang="scss" scoped>

.user-setting {
    width: 80%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    max-height: 1500px;
}

.delete-account {
    width: 80%;
    height: 6vh;
    max-height: 60px;
    font-size: 20px;
    color: red;
}

@media screen and (max-width: $phone-width) {
    .delete-account {
        font-size: 3vh;
    }
}
</style>
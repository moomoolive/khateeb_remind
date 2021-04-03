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
                :basedOn="{ username: $store.getters['user/allInfo'].username }"
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
                    basedOn: $store.getters['user/allInfo']
                }"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        
        <collapsable-box
            v-if="utils.validAuthentication({ max: 2 })"
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
            try {
                const res = await this.$API.user.updateInfo(update)
                this.storeToken(res.token)
                this.rerenderProfileSettings()
                this.utils.alert(`Successfully updated`, 'success')
            } catch(err) {
                console.log(err)
            }
        },
        storeToken(token) {
            this.$store.dispatch('user/updateToken', token)
        },
        rerenderProfileSettings() {
            this.showProfileSettings = false
            this.$nextTick(() => { this.showProfileSettings = true })
        },
        async deleteAccount() {
            try {
                const confirm = await this.utils.confirm(`Are you sure you want to permenantly delete your account?`)
                if (!confirm)
                    return
                await this.$API.user.deleteAccount()
                this.$store.dispatch('user/logout')
                this.utils.toHomePage()
                this.utils.alert(`Successfully delete account`, 'success')
            } catch(err) {
                console.log(err)
            }
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

@media screen and (max-width: $phoneWidth) {
    .delete-account {
        font-size: 3vh;
    }
}
</style>
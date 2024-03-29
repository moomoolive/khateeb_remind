<template>
    <div>
        <loading>

            <div v-if="Object.keys(userInfo).length > 0">
                
                <div class="signup-buttons-container">
                    <div>
                        <button 
                            class="signup-button purple"
                            @click="$router.push({ path: '/institution-selection' })"
                        >
                            Signup to an Institution
                        </button>
                    </div>
                    <div>
                        <button 
                            class="signup-button green" 
                            @click="$router.push({ path: '/create/institutions' })"
                        > 
                            Create an Institution
                        </button>
                    </div>
                </div>

                <div class="all-authorizations-container">
                    <div class="selected-role-container">
                        <div class="role-selection-text">
                            Role
                        </div>
                        <select v-model="selectedRole" class="selected-role-dropdown">
                            <option value="all">Any</option>
                            <option value="khateeb">Khateeb</option>
                            <option value="institutionAdmin">Admin</option>
                            <option value="rootInstitutionAdmin">Root Admin</option>
                        </select>
                    </div>
                    <div v-if="filteredAuthorizations.length > 0" class="all-authorizations">
                        <div
                            v-for="(authorization, authIndex) in filteredAuthorizations"
                            :key="authIndex" 
                            class="authorization-container"
                        >
                            <button
                                :disabled="
                                    !authorization.confirmed ||
                                    isGettingNewToken
                                "
                                class="authorization-button"
                                @click="upgradeUserAuthorization(authorization)"
                            >
                                <div class="authorization-text-description">
                                    Sign in as a
                                    <span class="blue">
                                        {{ _utils.stringFormat(authorization.authId.role) }}
                                    </span>
                                    @
                                    <span class="red">
                                        {{ _utils.stringFormat(authorization.authId.institution.name) }}
                                    </span>
                                </div>
                                <div class="authorization-bottom-section">
                                    
                                    <div class="confirmation-status">
                                        <span :class="authorization.confirmed ? 'green' : 'yellow' ">
                                            <fa-icon :icon="authorization.confirmed ? 'lock-open' : 'lock' " />
                                        </span>
                                        <span class="confirmation-status-text ">
                                            {{ authorization.confirmed ? "Confirmed" : 'Pending' }}
                                        </span>
                                    </div>

                                    <div 
                                        :class="`loading-icon ${loadingAuth === authorization._id ? '' : 'invisible' }`"
                                    >
                                        <img 
                                            src="~@/assets/gifs/loading.gif"
                                            class="loading-animation" 
                                            alt="loading animation"
                                        >
                                    </div>

                                </div>
                            </button>
                            <!-- 
                                root users and system administrators a little more unique than
                                normal users, as their authorization for going to system
                                administrator pages aren't actaully logged to the database 
                                check the backend for more info 
                            -->
                            <button 
                                :disabled="
                                    authorization._id === 'root' || 
                                    authorization._id === 'sysAdmin' ||
                                    isGettingNewToken
                                "
                                class="delete-auth-button yellow"
                                @click="removeAuthorization(authorization, authIndex)"
                            >
                                <div v-if="loadingAuthToSetting === 'none'">
                                    Remove Permissions
                                </div>
                                <div
                                    v-if="loadingAuthToSetting === authorization._id" 
                                    class="loading-to-settings-animation-container"
                                >
                                    <img 
                                        src="~@/assets/gifs/loading-alternate.gif"
                                        class="loading-to-settings-animation"
                                        alt="alternate loading animation"
                                    >
                                </div>
                            </button>
                        </div>
                    </div>

                    <general-message
                        v-else
                        :message="generalMessageText"
                        :fontAwesomeIcon="['fas', 'clipboard']"
                        iconColor="orange"
                        class="no-results-message"
                    />
                </div>

            </div>

            <general-message
                v-else
                :message="`Something went wrong when retrieving your information`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

import sleepHelpers from '@/libraries/sleep/main.js'

import Config from '$config'

export default {
    name: "userAuthorizations",
    components: {
        loading,
        generalMessage
    },
    data() {
        return {
            userInfo: {},
            loadingAuth: 'none',
            loadingAuthToSetting: 'none',
            readyToGoIntoInstitution: new Promise((resolve) => resolve(true)),
            readyToGoToSettings: new Promise((resolve) => resolve(true)),
            selectedRole: 'all'
        }
    },
    methods: {
        async getUserAuthorizations() {
            const data = await this._api.user.getUserAuthorizations()
            this.userInfo = data
            return this.$store.dispatch('user/updateUserInfo', data)
        },
        promptLoadingIconOnPressingAuthorization(id="12345") {
            this.loadingAuth = id
            this.readyToGoIntoInstitution = sleepHelpers.nonBlockingSleep(Config.networkConfig.defaultAuthIOLoadingTime)
        },
        stashTokenAndInstitutionData(token="a.JWT.token", institution={}) {
            this.$store.dispatch('user/updateToken', token)
            this.$store.dispatch('user/updateInstitutionInfo', institution)
        },
        async upgradeUserAuthorization(authInfo={}) {
            this.promptLoadingIconOnPressingAuthorization(authInfo._id)
            const token = await this.upgradeAuth(authInfo)
            if (!token) {
                this.resetloadingAuth()
                return this._utils.alert(`A problem occurred when signing in`)
            }
            // create a consistent delay before login
            await this.readyToGoIntoInstitution
            this.stashTokenAndInstitutionData(token, authInfo.authId.institution)
            return this.authUpgradeRedirect()
        },
        authUpgradeRedirect() {
            const landingPage = this.$store.state.router.landingPage
            if (
                !this.$store.state.app.hasLoggedInViaLoginPage && 
                landingPage !== this.$route.path &&
                landingPage !== '/login' &&
                landingPage !== "/"
            ) {
                this.$router.push(landingPage)
                this.$store.commit('app/loggedInViaLoginPage')
            } else {
                this._utils.toHomePage()
            }
        },
        async removeAuthorization(authorization={}, authIndex=0) {
            if (authorization.authId.role === 'rootInstitutionAdmin') {
                return this.pushToDelegationPage(authorization) 
            }
            const confirm = await this._utils.confirm(
                `Are you sure you want to remove these permissions? You'll no longer be able log into ${authorization.authId.institution.name} as a ${authorization.authId.role}`,
                "yellow",
                { hard: true, confirmationText: 'Remove Permissions' }
            )
            if (!confirm) {
                return
            }
            const code = await this._api.user.removeAuthorization({ 
                id: authorization._id, 
                institution: authorization.authId.institution._id,
                role: authorization.authId.role 
            })
            if (code === 0) {
                return this.userInfo.authorizations.splice(authIndex, 1) 
            }
        },
        async upgradeAuth(authInfo={}) {
            const { token } = await this._api.user.upgradeAuthorization({
                authId: authInfo.authId._id,
                role: authInfo.authId.role,
                institutionID: authInfo.authId.institution._id,
                institutionStatus: authInfo.authId.institution.__t || 'default'
            })
            return token
        },
        promptLoadingAlternateIconOnPressingRemovingPermissions(id="12345") {
            this.loadingAuthToSetting = id
            this.readyToGoToSettings = sleepHelpers.nonBlockingSleep(Config.networkConfig.defaultAuthIOLoadingTime)
        },
        async pushToDelegationPage(authorization={}) {
            const confirm = await this._utils.confirm(`You cannot remove root admin permissions from here, you must login then do so from the institution settings page by pressing 'delgate permissions' or deleting the institution entirely. Would you like to be taken there now?`)
            this.promptLoadingAlternateIconOnPressingRemovingPermissions(authorization._id)
            if (!confirm || !authorization.confirmed) {
                return this.resetLoadingAuthToSetting()
            }
            const token = await this.upgradeAuth(authorization)
            if (!token) {
                this.resetLoadingAuthToSetting()
                return this._utils.alert(`A problem occurred when signing in`)
            }
            this.stashTokenAndInstitutionData(token, authorization.authId.institution)
            await this.readyToGoToSettings
            return this.$router.push({ 
                path: `/institutionAdmin/settings`, 
                // open setting with delegation and deleting institution info
                // when page loads
                query: { click: "danger-zone" } 
            })
        },
        resetLoadingAuthToSetting() {
            return this.loadingAuthToSetting = 'none'
        },
        resetloadingAuth() {
            return this.loadingAuth = 'none'
        }
    },
    computed: {
        isGettingNewToken() {
            return this.loadingAuthToSetting !== 'none' || this.loadingAuth !== 'none'
        },
        filteredAuthorizations() {
            if (!this.userInfo.authorizations) {
                return []
            } else if (this.selectedRole === 'all') {
                return this.userInfo.authorizations
            } else {
                return this.userInfo.authorizations.filter(a => a.authId.role === this.selectedRole)
            }
        },
        generalMessageText() {
            if (this.selectedRole !== 'all') {
                return `None of your permissions match the role '${this._utils.stringFormat(this.selectedRole)}'`
            } else {
                return `You haven't signed up to any institutions yet`
            }
        }
    },
    watch: {
        userInfo(newVal) {
            if (!newVal.authorizations || newVal.authorizations.length < 1) {
                return
            }
            const userIsRootInstitutionAtOneInstitution = newVal.authorizations.find(a => {
                return a.authId.role === 'rootInstitutionAdmin'
            })
            this.$store.commit('user/changeRootAdminAtOneInstitutionStatus', Boolean(userIsRootInstitutionAtOneInstitution))
        }
    },
    created() {
        this.getUserAuthorizations()
    }
}
</script>

<style lang="scss" scoped>
.loading-to-settings-animation-container {
    height: 15px;
}

.authorization-text-description {
    min-height: 42px;
}

.loading-to-settings-animation {
    width: 30px;
    position: relative;
    bottom: 7px;
}   

.authorization-container {
    width: 80%;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.no-results-message {
    margin-bottom: 70px;
}

.all-authorizations {
    @include flexbox-default(row, true);
}

.all-authorizations-container {
    max-width: 900px;
    @include center-margin();
}

.role-selection-text {
    margin-right: 29px;
    font-size: 15px;
    margin-bottom: 3px;
}

.selected-role-dropdown {
    background: get-color('grey');
    color: get-color('off-white');
    outline: none;
    border: none;
    width: 90px;
    @include floating-box-shadow(0.4);
    height: 30px;
    @include normal-border-rounding();
}

.selected-role-container {
    text-align: right;
    margin-right: 2%;
    margin-bottom: 20px;
}

button {
    border-radius: 0;
}

.authorization-button {
    width: 100%;
    background: get-color('grey');
    padding-top: 20px;
    color: get-color("off-white");
    padding-bottom: 7px;
    padding-left: 5px;
    padding-right: 5px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-bottom: 0;
    @include floating-box-shadow(0.4);
    @include is-clickable();
    line-height: 22px;

    &:hover {
        background: lighten(get-color('grey'), 10%);
    }
}

.confirmation-status {
    text-align: left;
    font-size: 14px;
    padding-left: 9px;
    margin-top: 7px;
    width: 48%;
}

.authorization-bottom-section {
    display: flex;
    align-items: flex-end;
}

.loading-icon {
    width: 48%;
    text-align: right;

    &.invisible {
        visibility: hidden;
    }
}

.loading-animation {
    width: 45px;
    position: relative;
    top: 7px;
}

.delete-auth-button {
    margin-top: 0;
    color: get-color('grey');
    font-size: 15px;
    padding-top: 12px;
    padding-bottom: 12px;
    width: 100%;
    margin-bottom: 50px;
    @include floating-box-shadow(0.4);
    border-bottom-left-radius: 99999px;
    border-bottom-right-radius: 99999px;
}

.confirmation-status-text {
    margin-left: 3px;
}



.signup-buttons-container {
    @include flexbox-default();
    @include center-margin();
    margin-bottom: 50px;
}

.signup-button {
    @include floating-box-shadow(0.4);
    margin-right: 20px;
    margin-left: 20px;
}

@media screen and (max-width: $phone-width) {
    .signup-buttons-container {
        flex-direction: column;
    }

    .signup-button {
        @include floating-box-shadow(0.4);
        margin-right: 0px;
        margin-left: 0px;
    }

    .selected-role-container {
        margin-right: 8%;
    }
}
</style>
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

                <div v-if="userInfo.authorizations.length > 0" class="all-authorizations">
                    <div
                        v-for="(authorization, authIndex) in userInfo.authorizations"
                        :key="authIndex" 
                        class="authorization-container"
                    >
                        <button
                            :disabled="
                                !authorization.confirmed ||
                                (
                                    loadingAuth !== 'none' &&
                                    loadingAuth !== authorization._id
                                )
                            "
                            class="authorization-button"
                            @click="upgradeUserAuthorization(authorization)"
                        >
                            Sign in as a
                            <span class="blue">
                                {{ _utils.stringFormat(authorization.authId.role) }}
                            </span>
                            @
                            <span class="red">
                                {{ _utils.stringFormat(authorization.authId.institution.name) }}
                            </span>
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
                            :disabled="authorization._id === 'root' || authorization._id === 'sysAdmin'"
                            class="delete-auth-button yellow"
                            @click="removeAuthorization(authorization, authIndex)"
                        >
                            Remove these Permissions
                        </button>
                    </div>
                </div>

                <general-message
                    v-else
                    :message="`You haven't signed up to any institutions yet`"
                    :fontAwesomeIcon="['fas', 'clipboard']"
                    iconColor="orange"
                />

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
            readyToGoIntoInstitution: new Promise((resolve) => resolve(true))
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
            this.readyToGoIntoInstitution = new Promise(resolve => {
                const twoSecondsInMilliseconds = 2_000
                window.setTimeout(() => resolve(true), twoSecondsInMilliseconds)
            })
        },
        async upgradeUserAuthorization(authInfo={}) {
            this.promptLoadingIconOnPressingAuthorization(authInfo._id)
            const { token } = await this._api.user.upgradeAuthorization({
                authId: authInfo.authId._id,
                role: authInfo.authId.role,
                institutionID: authInfo.authId.institution._id,
                institutionStatus: authInfo.authId.institution.__t || 'default'
            })
            if (!token)
                return this._utils.alert(`A problem occurred when signing in`)
            // create a consistent delay before login
            await this.readyToGoIntoInstitution
            this.$store.dispatch('user/updateToken', token)
            this.$store.dispatch('user/updateInstitutionInfo', authInfo.authId.institution)
            return this.authUpgradeRedirect()
        },
        authUpgradeRedirect() {
            const landingPage = this.$store.state.router.landingPage
            if (
                !this.$store.state.app.hasLoggedInViaLoginPage && 
                landingPage !== this.$route.path &&
                landingPage !== '/login'
            ) {
                this.$router.push(landingPage)
                this.$store.commit('app/loggedInViaLoginPage')
            } else {
                this._utils.toHomePage()
            }
        },
        async removeAuthorization(authorization={}, authIndex=0) {
            const confirm = await this._utils.confirm(
                `Are you sure you want to remove these permissions? You'll no longer be able log into ${authorization.authId.institution.name} as a ${authorization.authId.role}`,
                "yellow",
                { hard: true, confirmationText: 'Remove Permissions' }
            )
            if (!confirm)
                return
            const code = await this._api.user.removeAuthorization({ 
                id: authorization._id, 
                institution: authorization.authId.institution._id,
                role: authorization.authId.role 
            })
            if (code === 0)
                return this.userInfo.authorizations.splice(authIndex, 1)
                
        }
    },
    created() {
        this.getUserAuthorizations()
    }
}
</script>

<style lang="scss" scoped>
.authorization-container {
    width: 80%;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.all-authorizations {
    @include flexbox-default(row, true);
    max-width: 900px;
    @include center-margin();
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
    cursor: pointer;
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
    margin-bottom: 20px;
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
}
</style>
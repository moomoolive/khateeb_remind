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
                            :disabled="!authorization.confirmed"
                            class="authorization-button"
                            @click="upgradeUserAuthorization(authorization.authId)"
                        >
                            Sign in as a
                            <span class="blue">
                                {{ _utils.stringFormat(authorization.authId.role) }}
                            </span>
                            @
                            <span class="red">
                                {{ _utils.stringFormat(authorization.authId.institution.name) }}
                            </span>
                            <div class="confirmation-status">
                                <span :class="authorization.confirmed ? 'green' : 'yellow' ">
                                    <fa-icon :icon="authorization.confirmed ? 'lock-open' : 'lock' " />
                                </span>
                                <span class="confirmation-status-text ">
                                    {{ authorization.confirmed ? "Confirmed" : 'Pending' }}
                                </span>
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

                <msg-with-pic 
                    v-else
                    :msg="`You haven't signed up to any institutions yet`"
                    :gif="`twirlingPlane`"
                />

            </div>

            <msg-with-pic 
                v-else
                :msg="`There was a problem retrieving your information`"
                :gif="`twirlingPlane`"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: "userAuthorizations",
    components: {
        loading,
        msgWithPic
    },
    data() {
        return {
            userInfo: {},
        }
    },
    methods: {
        async getUserAuthorizations() {
            const data = await this._api.user.getUserAuthorizations()
            this.userInfo = data
            return this.$store.dispatch('user/updateUserInfo', data)
        },
        async upgradeUserAuthorization(authInfo={}) {
            const { token } = await this._api.user.upgradeAuthorization({
                authId: authInfo._id,
                role: authInfo.role,
                institutionID: authInfo.institution._id
            })
            if (!token)
                return this._utils.alert(`A problem occurred when signing in`)
            this.$store.dispatch('user/updateToken', token)
            this.$store.dispatch('user/updateInstitutionInfo', authInfo.institution)
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
                `Are you sure you want to remove this permission? You'll no longer be able log into ${authorization.authId.institution.name} as a ${authorization.authId.role}`
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
    @include flexboxDefault(row, true);
    max-width: 900px;
    @include centerMargin();
}

button {
    border-radius: 0;
}

.authorization-button {
    width: 100%;
    background: getColor('grey');
    padding-top: 20px;
    color: getColor("offWhite");
    padding-bottom: 7px;
    padding-left: 5px;
    padding-right: 5px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-bottom: 0;
    @include floatingBoxShadow(0.4);
    cursor: pointer;
    line-height: 22px;

    &:hover {
        background: lighten(getColor('grey'), 10%);
    }
}

.confirmation-status {
    text-align: left;
    font-size: 14px;
    padding-left: 9px;
    margin-top: 7px;
}

.delete-auth-button {
    margin-top: 0;
    color: getColor('grey');
    font-size: 15px;
    padding-top: 12px;
    padding-bottom: 12px;
    width: 100%;
    margin-bottom: 50px;
    @include floatingBoxShadow(0.4);
    border-bottom-left-radius: 99999px;
    border-bottom-right-radius: 99999px;
}

.confirmation-status-text {
    margin-left: 3px;
}

.signup-buttons-container {
    @include flexboxDefault();
    @include centerMargin();
    margin-bottom: 20px;
}

.signup-button {
    @include floatingBoxShadow(0.4);
}

@media screen and (max-width: $phoneWidth) {
    .signup-buttons-container {
        flex-direction: column;
    }
}
</style>
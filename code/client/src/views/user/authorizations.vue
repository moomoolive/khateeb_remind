<template>
    <div>
        <loading>

            <div v-if="Object.keys(userInfo).length > 0">
                <div
                    v-for="(authorization, authIndex) in userInfo.authorizations"
                    :key="authIndex"
                    class="authorization-container"
                    @click="upgradeUserAuthorization(authorization)"
                >
                    Sign in as a <br>
                    <span class="blue">
                        {{ _utils.stringFormat(authorization.role) }}
                    </span> <br>
                    @ <br>
                    <span class="red">
                        {{ _utils.stringFormat(authorization.institution.name) }}
                    </span>
                </div>
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
    background: getColor('grey');
    padding-top: 20px;
    color: getColor("offWhite");
    padding-bottom: 20px;
    padding-left: 5px;
    padding-right: 5px;
    @include lightBorderRounding();
    @include floatingBoxShadow();
    margin-bottom: 20px;
    cursor: pointer;
    line-height: 25px;

    &:hover {
        background: lighten(getColor('grey'), 10%);
    }
}
</style>
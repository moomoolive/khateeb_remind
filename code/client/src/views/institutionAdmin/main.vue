<template>
    <div>
        <central-nav 
            :baseLink="`institutionAdmin`"
            :outboundLinks="outboundLinks"
        />
        <vue-page-transition :name="routerConfig.animationName">
            <router-view class="pages"></router-view>
        </vue-page-transition>
    </div>
</template>

<script>
import centralNav from '@/components/misc/centralNav.vue'

import Config from '$config'

export default {
    name: 'adminParentRoute',
    components: {
        centralNav,
    },
    data() {
        return {
            currentRoute: this.$router.currentRoute.fullPath,
            routerConfig: Config.routerConfig,
            outboundLinks: [
                {
                    name: 'Set Schedule',
                    route: 'schedule'
                },
                {
                    name: 'Announcements',
                    route: 'announcements'
                },
                {
                    name: 'Khateebs',
                    route: 'khateebs',
                    blinking: false,

                },
                {
                    name: 'Other Administrators',
                    route: 'create-others',
                    auth: { level: 4 },
                    blinking: false
                },
                {
                    name: 'Settings',
                    route: 'settings'
                },
            ]
        }
    },
    methods: {
        async verifyPending() {
            const pendingKhateebs = await this._api.khateebs.getKhateebs({ confirmed: false })
            const pendingCount = pendingKhateebs.length
            this.outboundLinks[2].blinking = pendingCount > 0
        },
        async fetchPendingInstitutionAdminCount() {
            if (this.$store.getters['user/type'] !== 'rootInstitutionAdmin')
                return
            const pendingAdmins = await this._api.institutionAdmins.getOtherAdmins({ confirmed: false })
            this.outboundLinks[3].blinking = pendingAdmins.length > 0
        },
        getPendingUsersCount() {
            this.verifyPending()
            this.fetchPendingInstitutionAdminCount()
        }
    },
    watch:{
        currentRoute(newVal) {
            if (newVal === '/institutionAdmin') {
                this.getPendingUsersCount()
            }
        }
    },
    updated() {
        this.currentRoute = this.$router.currentRoute.fullPath
    },
    created() {
        this.getPendingUsersCount()
    }
}
</script>

<style lang="scss" scoped>
.pages {
    margin-top: 20px;
}

.return-to-central-container {
    width: 95%;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}

.back-to-central {
    width: 23%;
    max-width: 110px;
    height: 5vh;
    max-height: 45px;
    border-radius: 100px 100px 100px 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
}

.make-more-changes {
    max-width: 220px;
    font-size: 17px;
}

.back-arrow {
    float: left;
}

p {
    margin: 0;
    text-align: right;
}

@media screen and (max-width: $phone-width) {
      .notifications-size-position {
        width: 70%;
        height: 35vh;
        font-size: 2vh;
      }
      .page-padding {
        padding-bottom: 5%;
        padding-top: 13% !important;
      }
      .make-more-changes {
            max-width: 220px;
            font-size: 2vh;
        }
}
</style>
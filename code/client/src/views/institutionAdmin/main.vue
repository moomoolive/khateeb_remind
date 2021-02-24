<template>
    <div>
        <central-nav 
            :baseLink="`institutionAdmin`"
            :outboundLinks="outboundLinks"
            @to-central="closeSuccessScreen()"
        />
        <transition
        name="fade"
        mode="out-in"
        >
            <router-view
                v-if="!savedChanges" 
                class="pages"
            ></router-view>
        </transition>
        <div v-if="savedChanges">
            <msg-with-pic
                title="Alhamdillah!"
                gif="flyingPlanesAllOver"
                msg="Changes successfully made!"
            />
            <button 
                class="green make-more-changes"
                @click="closeSuccessScreen()"
            >
                Make More Changes
            </button>
        </div>
    </div>
</template>

<script>
import centralNav from '@/components/misc/centralNav.vue'

export default {
    name: 'adminParentRoute',
    components: {
        centralNav
    },
    data() {
        return {
            currentRoute: this.$router.currentRoute.fullPath,
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
                    indicator: null
                },
                {
                    name: 'Other Administrators',
                    route: 'create-others',
                    auth: { level: 3 }
                },
                {
                    name: 'Settings',
                    route: 'settings'
                },
            ]
        }
    },
    methods: {
        closeSuccessScreen() {
            const successScreenOpen = this.$store.state.admin.savedChanges
            if (successScreenOpen)
                this.$store.dispatch('adminSavedChangesScreen', false)
        },
        async verifyPending() {
            try {
                const pendingCount = await this.$API.misc.pendingKhateebCount()
                this.outboundLinks[2].indicator = pendingCount ? `${pendingCount} Pending` : pendingCount
            } catch(err) {
                console.log(err)
            }
        },
    },
    computed: {
        savedChanges() {
            return this.$store.state.admin.savedChanges
        }
    },
    watch:{
        currentRoute(newVal) {
            if (newVal === '/institutionAdmin')
                this.verifyPending()
        }
    },
    updated() {
        this.currentRoute = this.$router.currentRoute.fullPath
    },
    destroyed() {
        this.closeSuccessScreen()
    },
    created() {
        this.verifyPending()
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

@media screen and (max-width: $phoneWidth) {
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
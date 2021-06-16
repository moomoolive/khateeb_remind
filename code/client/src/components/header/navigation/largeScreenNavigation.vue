<template>
    <div>
        <div class="top-section">
            <fa-icon icon="compass" />
        </div>
        
        <nav>
            <div class="navigation-links-container">

                <div v-if="isLoggedIn">
                    <div v-if="authLevel === 1">
                        <div class="navigation-container"  @click="redirect('/authorizations')">
                            Login Selection
                        </div>
                        <div class="navigation-container" @click="redirect('/institution-selection')">
                            Institution Signup
                        </div>
                    </div>

                    <div v-if="authLevel === 2">
                        <div class="navigation-container" @click="redirect('/khateeb/')">
                            Schedule
                        </div>
                        <div class="navigation-container" @click="redirect('/khateeb/announcements')">
                            Announcements
                        </div>
                        <div class="navigation-container" @click="redirect('/khateeb/my-khutbahs')">
                            My Khutbahs
                        </div>
                        <div class="navigation-container" @click="redirect('/khateeb/availability')">
                            Availability
                        </div>
                    </div>

                    <div v-if="authLevel === 3 || authLevel === 4">
                        <div class="navigation-container" @click="redirect('/institutionAdmin/schedule')">
                            Set Schedule
                        </div>
                        <div class="navigation-container" @click="redirect('/institutionAdmin/announcements')">
                            Announcements
                        </div>
                        <div class="navigation-container" @click="redirect('/institutionAdmin')">
                            Admin Central
                        </div>
                    </div>
                    
                    <div v-if="authLevel >= 5">
                        <div class="navigation-container" @click="redirect('/sysAdmin')">
                            Admin Central
                        </div>
                    </div>

                    <div 
                        class="navigation-container" 
                        @click="
                            $store.dispatch('notifications/create', { 
                                type: 'notificationScroller',
                                options: {
                                    color: 'grey'
                                } 
                            })
                        "
                    >
                        Notifications
                    </div>

                    <div class="navigation-container" @click="redirect('/user')">
                        Profile
                    </div>

                    <div class="navigation-container" @click="redirect('/notification-subscriptions')">
                        Settings
                    </div>

                    <div class="navigation-container green-color" @click="tutorials()">
                        Tutorials
                    </div>
                    
                    <div
                        v-if="!$store.getters['user/isLoggedInAsGenericUser']" 
                        class="navigation-container yellow-color"
                        @click="$store.dispatch('user/downgradeUserAuthorization')"
                    >
                        Exit Institution
                    </div>
                    
                    <div 
                        class="navigation-container red-color"
                        @click="logout()"
                    >
                        Logout
                    </div>
                </div>

                <div v-else>
                    <div class="navigation-container" @click="redirect('/login')">
                        Login
                    </div>
                    <div class="navigation-container" @click="redirect('/create/user')">
                        Signup
                    </div>
                </div>

            </div>
        </nav>

        <div class="bottom-section">
            -{ وقل ربي زدني علماً }-
        </div>

    </div>
</template>

<script>
import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    name: "largeScreenNavigation",
    methods: {
        redirect(path) {
            if (path !== this.$router.currentRoute.fullPath) {
                this.$router.push(path)
            }
        },
        async logout() {
            const confirm = await this._utils.confirm(`Are you sure you want to logout?`)
            if (!confirm) {
                return
            }
            this.$store.dispatch('user/logout')
        },
        tutorials() {
            notificationHelpers.tutorial('general', 1)
        },
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters["user/isLoggedIn"]
        },
        authLevel() {
            return this.$store.getters["user/authLevel"]
        }
    }
}
</script>

<style lang="scss" scoped>
.navigation-container {
    color: get-color("off-white");
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 18px;
    cursor: pointer;
    background: lighten(get-color("grey", 1), 5%);
    width: 100%;

    &:hover {
        background: get-color("light-grey");
    }
    

    &.yellow-color {
        background: get-color("yellow");
        color: black;

        &:hover {
            background-color: lighten(get-color("yellow", 1), 20%);
        }
    }

    &.red-color {
        background: get-color("red");
        color: black;

        &:hover {
            background-color: lighten(get-color("red", 1), 20%);
        }
    }

    &.green-color {
        background: get-color("green");
        color: black;

        &:hover {
            background-color: lighten(get-color("green", 1), 20%);
        }
    }
}

.navigation-links-container {
    width: 100%;
}

.top-section {
    color: get-color("blue");
    font-size: 25px;
    padding-top: 7px;
    padding-bottom: 8px;
    width: 100%;
}

.bottom-section {
    position: absolute;
    bottom: 10px;
    color: get-color("blue");
    width: 100%;
    @include alternate-font();
}
</style>
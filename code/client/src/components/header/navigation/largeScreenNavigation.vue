<template>
    <div>
        <div class="top-section">
            <fa-icon icon="compass" />
        </div>
        
        <nav>
            <div class="navigation-links-container">

                <div v-if="isLoggedIn">
                    <div v-if="authLevel === 1">
                        <div 
                            :class="`navigation-container ${highlightContainer('/authorizations')}`" 
                            @click="redirect('/authorizations')"
                        >
                            Login Selection
                        </div>
                        <div 
                            :class="`navigation-container ${highlightContainer('/institution-selection')}`"
                            @click="redirect('/institution-selection')"
                        >
                            Institution Signup
                        </div>
                    </div>

                    <div v-if="authLevel === 2">
                        <div 
                            :class="`navigation-container ${highlightContainer('/khateeb/')}`" 
                            @click="redirect('/khateeb/')"
                        >
                            Schedule
                        </div>
                        <div 
                            :class="`navigation-container ${highlightContainer('/khateeb/announcements')}`" 
                            @click="redirect('/khateeb/announcements')"
                        >
                            Announcements
                        </div>
                        <div 
                            :class="`navigation-container ${highlightContainer('/khateeb/my-khutbahs')}`" 
                            @click="redirect('/khateeb/my-khutbahs')"
                        >
                            My Khutbahs
                        </div>
                        <div 
                            :class="`navigation-container ${highlightContainer('/khateeb/availability')}`"
                            @click="redirect('/khateeb/availability')"
                        >
                            Availability
                        </div>
                    </div>

                    <div v-if="authLevel === 3 || authLevel === 4">
                        <div 
                            :class="`navigation-container ${highlightContainer('/institutionAdmin/schedule')}`" 
                            @click="redirect('/institutionAdmin/schedule')"
                        >
                            Set Schedule
                        </div>
                        <div 
                            :class="`navigation-container ${highlightContainer('/institutionAdmin/announcements')}`" 
                            @click="redirect('/institutionAdmin/announcements')"
                        >
                            Announcements
                        </div>
                        <div 
                            :class="`navigation-container ${highlightContainer('/institutionAdmin')}`" 
                            @click="redirect('/institutionAdmin')"
                        >
                            Admin Central
                        </div>
                    </div>
                    
                    <div v-if="authLevel >= 5">
                        <div 
                            :class="`navigation-container ${highlightContainer('/sysAdmin')}`"
                            @click="redirect('/sysAdmin')"
                        >
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

                    <div 
                        :class="`navigation-container ${highlightContainer('/user')}`"
                        @click="redirect('/user')"
                    >
                        Profile
                    </div>

                    <div 
                        :class="`navigation-container ${highlightContainer('/notification-subscriptions')}`" 
                        @click="redirect('/notification-subscriptions')"
                    >
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
                    <div 
                        :class="`navigation-container ${highlightContainer('/login')}`"
                        @click="redirect('/login')"
                    >
                        Login
                    </div>
                    <div 
                        :class="`navigation-container ${highlightContainer('/create/user')}`" 
                        @click="redirect('/create/user')"
                    >
                        Signup
                    </div>
                </div>

            </div>
        </nav>

        <collapse-transition :duration="600">
            <div v-show="isLoggedIn" class="bottom-section">
                <div>
                    @{{ $store.state.user.userInfo.handle }}
                </div>
                <div :class="`institution-name ${!isLoggedIntoInstitution ? 'invisible' : ''}`">
                    {{ $store.state.user.institution.abbreviatedName || "default" }}
                </div>
            </div>
        </collapse-transition>

    </div>
</template>

<script>
import notificationHelpers from '@/libraries/notifications/main.js'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: "largeScreenNavigation",
    components: {
        CollapseTransition
    },
    data() {
        return {
            route: this.$route.path
        }
    },
    methods: {
        redirect(path) {
            if (path !== this.$router.currentRoute.fullPath) {
                this.$router.push(path)
            }
        },
        highlightContainer(path) {
            if (path === this.route) {
                return "silver-color"
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
        },
        isLoggedIntoInstitution() {
            return !this.$store.getters["user/isLoggedInAsGenericUser"]
        }
    },
    watch: {
        $route(newValue) {
            this.route = newValue.path
        } 
    }
}
</script>

<style lang="scss" scoped>
$alternate-grey-lightness : 5%;

.navigation-container {
    color: get-color("off-white");
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 18px;
    @include is-clickable();
    background: lighten(get-color("grey", 1), $alternate-grey-lightness);
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

    &.silver-color {
        background: get-color("silver");
        color: black;

        &:hover {
            background-color: lighten(get-color("silver", 1), 20%);
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
    bottom: 0px;
    padding-bottom: 20px;
    padding-top: 20px;
    color: get-color("blue");
    background: lighten(get-color("grey", 1), $alternate-grey-lightness);;
    width: 100%;
    @include alternate-font();
}

.institution-name {
    color: get-color('off-white');
    font-size: 14px;
}

.invisible {
    visibility: hidden;
}
</style>
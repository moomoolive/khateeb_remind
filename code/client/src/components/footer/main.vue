<template>
    <div class="footer-container">
        <div class="bottom-nav">
            
            <collapse-transition :duration="600">
                <div v-show="isLoggedIn" class="footer-links-section">
                    <div class="footer-links-section-header">
                        Users
                    </div>
                    <div class="footer-links-header-divide"></div>
                    <a
                        class="green"
                        :href="feedbackURL" 
                        target="_blank"
                    >
                        Feedback
                    </a>
                    <a 
                        v-if="!$store.getters['user/isLoggedInAsGenericUser']" 
                        class="green"
                        @click="$store.dispatch('user/downgradeUserAuthorization')"
                    >
                        Exit Institution
                    </a>
                    <a 
                        class="green"
                        @click="logout()"
                    >
                        Logout
                    </a>
                </div>
            </collapse-transition>

            <div class="footer-links-section">
                <div class="footer-links-section-header">
                    Info
                </div>
                <div class="footer-links-header-divide"></div>
                
                <a 
                    class="green" 
                    @click="toUsecasePage()"
                >
                    Why Use Khateeb Remind?
                </a>

                <a 
                    class="green" 
                    @click="toHomepage()"
                >
                    Homepage
                </a>

            </div>

            <div class="footer-links-section">
                <div class="footer-links-section-header">
                    Devs
                </div>
                <div class="footer-links-header-divide"></div>
                
                <a 
                    class="green" 
                    href="https://github.com/moomoolive/khateeb_remind"
                    target="_blank"
                >
                    Contribute to Source Code
                </a>
                
            </div>

        </div>

        <div class="footer-logo" @click="_utils.toHomePage()">
            <div class="khateeb-remind-name">
                <span class="green bottom-logo">
                    <fa-icon :icon="['far', 'paper-plane']" />
                </span>
                Khateeb Remind
            </div>
        </div>
    </div>
</template>

<script>
import Config from '$config'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: 'Footer',
    components: {
        CollapseTransition
    },
    data() {
        return {
            feedbackURL: Config.thirdPartyServicesConfig.feedbackFormURL
        }
    },
    methods: {
        toUsecasePage() {
            if (this.$router.currentRoute.fullPath !== '/usecase')
                return this.$router.push({ path: "/usecase" })
        },
        toHomepage() {
            if (this.$router.currentRoute.fullPath !== '/')
                return this.$router.push({ path: "/" })
        },
        async logout() {
            const confirm = await this._utils.confirm(`Are you sure you want to logout?`)
            if (!confirm)
                return
            this.$store.dispatch('user/logout')
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters['user/isLoggedIn']
        }
    },
}
</script>

<style lang="scss" scoped>
.footer-container {
    background: get-color('grey');
    padding-bottom: 2px;
    position: relative;
    z-index: 1;
    min-height: 12.08vh;
}

.bottom-nav {
    width: 65vw;
    max-width: 950px;
    min-width: 250px;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 40px;
}

a {
    position: relative;
    display: block;
    text-decoration: none;
    color: get-color("silver");
    font-size: 12px;
    margin-bottom: 9px;
    cursor: pointer;
    
    &:hover {
        color: get-color("blue") !important;
    }
    
    &.green {
        color: get-color("green");
    }
}

.bottom-logo {
    margin-right: 3px;
}

.footer-links-section {
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 40px;
}


.footer-links-section-header {
    font-size: 15px;
    color: get-color("blue");
    font-weight: bold;
}

.footer-links-header-divide {
    height: 2px;
    width: 5em;
    margin-top: 2px;
    margin-bottom: 8px;
    background: get-color("purple");
}

.khateeb-remind-logo {
    width: 12px;
    margin-right: 5px;
}

.khateeb-remind-name {
    font-size: 11px;
    color: get-color("off-white");

    &:hover {
        color: get-color("blue") !important;
    }
}

.footer-logo {
    @include flexbox-default();
    margin-bottom: 10px;
    margin-left: auto;
    width: 118px;
    cursor: pointer;
}

@media screen and (max-width: $phone-width) {
    a {
        margin-bottom: 12px;
    }

    .footer-links-section-header {
        font-size: 13px;
        margin-right: 0px;
    }

    .footer-links-section {
        margin-top: 0px;
        padding-bottom: 15px;
        margin-left: 20px;
        margin-right: 40px;

        &:first-child {
            margin-top: 15px;
        }

        &:last-child {
            padding-bottom: 0px;
        }
    }

    .footer-links-section {
        margin-bottom: 00px;
        margin-top: 10px;
        margin-left: 10px;
    }

    .bottom-nav {
        flex-direction: column;
        justify-content: center;
        padding-top: 7px;
        padding-bottom: 0;
    }

    .footer-links-header-divide {
        width: 3.5em;
    }

}
</style>
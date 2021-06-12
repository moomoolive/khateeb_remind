<template>
    <div class="footer-container">

        <div class="footer-divider"></div>

        <div class="bottom-nav">
            
            <collapse-transition :duration="600">
                <div v-show="isLoggedIn" class="footer-links-section">
                    <div class="footer-links-section-header">
                        Users
                    </div>
                    <div class="footer-links-header-divide"></div>
                    <nav>
                        <a
                            :href="feedbackURL"
                            rel="noopener" 
                            target="_blank"
                        >
                            Feedback
                        </a>
                        <a 
                            v-if="!$store.getters['user/isLoggedInAsGenericUser']" 
                            @click="$store.dispatch('user/downgradeUserAuthorization')"
                        >
                            Exit Institution
                        </a>
                        <a 
                            @click="logout()"
                        >
                            Logout
                        </a>
                    </nav>
                </div>
            </collapse-transition>

            <div class="footer-links-section">
                <div class="footer-links-section-header">
                    Info
                </div>
                <div class="footer-links-header-divide"></div>
                <nav>
                    <a 
                        @click="toHomepage()"
                    >
                        Homepage
                    </a>

                    <a 
                        @click="toUsecasePage()"
                    >
                        Why Use Khateeb Remind?
                    </a>
                </nav>

            </div>

            <div class="footer-links-section">
                <div class="footer-links-section-header">
                    Devs
                </div>
                <div class="footer-links-header-divide"></div>
                <nav>
                    <a 
                        :href="sourceCodeURL"
                        target="_blank"
                        rel="noopener"
                    >
                        Contribute to Source Code
                    </a>
                </nav>
                
            </div>

        </div>

        <div class="footer-logo" @click="_utils.toHomePage()">
            <div class="khateeb-remind-name">
                <span class="bottom-logo">
                    <fa-icon :icon="['far', 'paper-plane']" />
                </span>
                Khateeb Remind
            </div>
        </div>
    </div>
</template>

<script>
import Config from 'config$'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: 'Footer',
    components: {
        CollapseTransition
    },
    data() {
        return {
            feedbackURL: Config.thirdPartyServicesConfig.feedbackFormURL,
            sourceCodeURL: Config.thirdPartyServicesConfig.sourceCodeRepoURL
        }
    },
    methods: {
        toUsecasePage() {
            return window.open(Config.thirdPartyServicesConfig.marketingPages, "_blank", "noopener")
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
    padding-bottom: 2px;
    position: relative;
    z-index: 1;
    min-height: 12.08vh;
}

.footer-divider {
    background: get-color("mint", 0.6);
    width: 20%;
    min-width: 60px;
    height: 3px;
    @include center-margin();
    @include completely-round-border();
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

.footer-links-section-header {
    font-size: 18px;
    font-weight: bold;
    color: get-color("dark-blue")
}

a {
    position: relative;
    display: block;
    text-decoration: none;
    color: get-color("silver");
    font-size: 15px;
    margin-bottom: 9px;
    cursor: pointer;
    color: get-color("dark-blue");
    @include alternate-font();
    
    &:hover {
        color: get-color("mint") !important;
    }
}

.footer-links-section {
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 40px;
}

.footer-links-header-divide {
    height: 2px;
    width: 5em;
    margin-top: 2px;
    margin-bottom: 6px;
}

.khateeb-remind-name {
    font-size: 13px;
    @include alternate-font();

    &:hover {
        color: get-color("mint") !important;
    }
}

.bottom-logo {
    margin-right: 3px;
    color: get-color("mint");
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
        margin-bottom: 20px;
    }

    .footer-links-section-header {
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
        margin-bottom: 20px;
    }

}
</style>
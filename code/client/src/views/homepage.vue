<template>
    <div class="hompage-background">
        
        <div class="content-layer">
            <div class="signup-now-container">
                <div class="main-header">
                    Effortless Khateeb Scheduling
                </div>
                <div class="sub-header">
                    Automate. Centralize.
                </div>
                <div class="description-container">
                    <div class="description">
                        Khateeb Remind automates the boring khateeb scheduling 
                        stuff, leaving you time to tend to important
                        things: training khateebs, writing khutbahs, 
                        eating shawarma, etc.
                    </div>
                    <div class="usecase-text">
                        <a :href="marketingWebsite" target="_blank" rel="noopener">
                            <span class="blue green-hover">
                                Why use Khateeb Remind?
                            </span>
                        </a>
                    </div>
                </div>
                <div class="buttons-container">
                    <button 
                        class="purple" 
                        @click="$router.push({ path: '/create/user' })"
                    >
                        Get started
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Config from 'config$'

export default {
    name: "khateebRemindHomepage",
    data() {
        return {
            marketingWebsite: Config.thirdPartyServicesConfig.marketingPages
        }
    },
    created() {
        if (this.$store.state.router.firstPage && this.$store.getters['user/isLoggedIn'])
            this._utils.toHomePage()
    }
}
</script>

<style lang="scss" scoped>
.content-layer {
    width: 90vw;
    @include center-margin();
    min-height: 50vh !important;
    padding-top: 10vh;
}

.signup-now-container {
    margin-left: 12vw;
    margin-right: auto;
    background: get-color("silver");
    width: 75%;
    max-width: 400px;
    padding-top: 20px;
    padding-bottom: 20px;
    @include floating-box-shadow();
    @include normal-border-rounding();
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
}

.credits {
    margin-top: 40px;
    font-size: 11px;
}

.main-header {
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 20px;
}

.sub-header {
    font-size: 18px;
}

.main-features {
    margin-top: 3px;
    font-size: 13px;
}

.description {
    font-size: 15px;
    margin-top: 20px;
}

.usecase-text {
    font-size: 14px;
    margin-top: 25px;
}

.description-container {
    margin-top: 20px;
}

.buttons-container {
    margin-top: 35px;
}

button {
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 0;
    @include floating-box-shadow(0.3);
}

.green-hover {
    &:hover {
        color: get-color("green");
    }
}

@media screen and (max-width: $phone-width) {

    .content-layer {
        padding-bottom: 8vh;
    }

    button {
        font-size: 14px;
    }

    .signup-now-container {
        @include center-margin();
    }

    .main-header {
        font-size: 19px;
    }
}

@media screen and (min-width: $desktop-width) {
    .hompage-background {
        background-position: 0% 15%;
    }
}
</style>
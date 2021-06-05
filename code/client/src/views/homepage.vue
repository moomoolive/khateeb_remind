<template>
    <div class="hompage-background">
        
        <div class="content-layer">
            <div class="signup-now-container">
                <div class="main-header">
                    Stress-free Khateeb Scheduling
                </div>
                <div class="description-container">
                    <div class="description">
                        Scheduling khateebs every week can be tough,
                        especially when most of them are volunteers.
                        Khateeb Remind automates your khateeb schedule for you - 
                        no matter how complex your situation is (insha'Allah), 
                        leaving you extra time to think about better ways to train your 
                        khateebs, eat shawarma, or do whatever else you want. 
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
                        Get Started
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Config from '$config'

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
    min-height: 79vh !important;
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
    line-height: 23px;
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
    margin-top: 40px;
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
        font-weight: bold;
        font-size: 19px;
        line-height: 18px;
    }
}

@media screen and (min-width: $desktop-width) {
    .hompage-background {
        background-position: 0% 15%;
    }
}
</style>
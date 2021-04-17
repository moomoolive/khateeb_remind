<template>
    <div class="hompage-background">
        
        <div class="content-layer">
            <div class="signup-now-container">
                <div class="main-header">
                    Take the Stress Out of Khateeb Scheduling
                </div>
                <div class="main-features">
                   <i>Free. Automated. Simple.</i>
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
                        <a href="/usecase"><span class="blue">Why use Khateeb Remind?</span></a>
                    </div>
                </div>
                <div class="buttons-container">
                    <button class="purple" @click="$router.push({ path: '/create/institutions' })">
                        Signup My Institution
                    </button>
                    <button class="green" @click="$router.push({ path: '/institution-selection' })">
                        Signup as a Khateeb
                    </button>
                </div>
                <div class="credits">
                    Photo by 
                    <a href="https://unsplash.com/@fatihyurur?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">
                        <span class="green">Fatih Yürür</span>
                    </a>
                    , hosted @
                    <a href="https://unsplash.com/@fatihyurur?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">
                        <span class="purple">Unsplash</span>
                    </a> 
                </div>
            </div>
        </div>

        <div class="image-container">
            <img 
                class="main-image" 
                src="~@/assets/misc/insideMasjid.jpg" 
                alt="picture of masjid"
            >
        </div>

    </div>
</template>

<script>
export default {
    name: "khateebRemindHomepage",
    created() {
        if (this.$store.state.router.firstPage && this.$store.getters['user/isLoggedIn'])
            this.utils.toHomePage()
    }
}
</script>

<style lang="scss" scoped>
.hompage-background {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    background: getColor("grey") !important;
}

.main-image {
    width: 100vw;
    min-width: 450px;
}

a {
    text-decoration: none;
}

.image-container {
    max-height: 1000px;
    overflow-y: hidden;
    position: relative;
    z-index: 1;
    max-height: 1550px;
}

.content-layer {
    position: absolute;
    z-index: 2;
    margin-top: 90px;
    width: 100vw;
}

.signup-now-container {
    margin-left: 12vw;
    margin-right: auto;
    background: getColor("silver");
    width: 75%;
    max-width: 400px;
    padding-top: 20px;
    padding-bottom: 20px;
    @include floatingBoxShadow();
    @include normalBorderRounding();
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
    margin-top: 15px;
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
    @include floatingBoxShadow(0.3);
}

@media screen and (max-width: $phoneWidth) {
      .content-layer {
        margin-top: 70px;
    }

    button {
        font-size: 14px;
    }

    .signup-now-container {
        @include centerMargin();
    }

    .main-header {
        font-weight: bold;
        font-size: 19px;
        line-height: 18px;
    }
}

@media screen and (min-width: $desktopWidth) {
    .main-image {
        position: relative;
        top: -110px;
    }
}
</style>
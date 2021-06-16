<template>
    <div class="banner-container">
            <transition name="fade">
                <span v-show="showMsg">
                    <span class="text-container">
                        {{ currentlyDisplayedMsg }}
                    </span>
                </span>
            </transition>
            <span 
                v-if="showCloseIcon && $store.state.websiteBanner.show" 
                class="close-banner-icon"
            >
                <fa-icon icon="times" @click="$store.commit('websiteBanner/hide')" />
            </span>
    </div>
</template>

<script>
export default {
    name: "websiteBanner",
    data() {
        return {
            displayMsgs: [],
            defaultDisplayMsgs: {
                friday: [
                    "🎉 اليوم يوم الجمعة 🎉",
                    "🤲🏽 صلو على النبي 🤲🏽",
                    "🎉 Today is Friday 🎉",
                    "🤲🏽 Send Salams Upon the Prophet 🤲🏽"
                ]
            },
            displayIndex: 0,
            componentIsDestroyed: false,
            showMsg: true,
            currentlyDisplayedMsg: '',
            showCloseIcon: false
        }
    },
    methods: {
        loopThroughMsgs() {
            if (this.displayIndex !== this.displayMsgs.length - 1) {
                this.displayIndex++
            } else {
                this.displayIndex = 0
            }
        },
        msgLoop() {
            const sevenSecondsInMilliseconds = 7_000
            const loop = window.setInterval(() => {
                if (this.componentIsDestroyed) {
                    window.clearInterval(loop)
                } else {
                    this.loopThroughMsgs()
                }
            }, sevenSecondsInMilliseconds)
        },
        scheduleBannerHiding() {
            const sevenSecondsInMilliseconds = 7_000
            const timePerItem = sevenSecondsInMilliseconds * 2
            const numberOfItems = this.displayMsgs.length
            const closeAfter = timePerItem * numberOfItems
            window.setTimeout(() => { 
                this.$store.commit('websiteBanner/hide')
            }, closeAfter)
        },
        siteBannerHasContent() {
            return this.displayMsgs.length > 0
        },
        createBanner() {
            const oneSecondInMilliseconds = 1_000
            window.setTimeout(() => {
                this.currentlyDisplayedMsg = this.displayMsgs[0]
                this.$store.commit("websiteBanner/show")
                this.msgLoop()
                this.scheduleBannerHiding()
            }, oneSecondInMilliseconds)
        },
        fillBannerContent() {
            const isFriday = new Date().getDay() === 5
            if (isFriday) {
                this.displayMsgs = this._utils.deepCopy(this.defaultDisplayMsgs.friday)
            }
        }
    },
    computed: {
        userIsLoggedIn() {
            return this.$store.getters['user/isLoggedIn']
        }
    },
    watch: {
        userIsLoggedIn(newVal) {
            if (newVal && this.siteBannerHasContent()) {
                this.createBanner()
            }  
        },
        displayIndex(newVal) {
            this.showMsg = false
            const halfASecondInMilliseconds = 500
            window.setTimeout(() => {
                this.currentlyDisplayedMsg = this.displayMsgs[newVal]
                this.showMsg = true
            }, halfASecondInMilliseconds)
        }
    },
    created() {
        this.fillBannerContent()
        const milliseconds = 1_300
        window.setTimeout(() => this.showCloseIcon = true, milliseconds)
    },
    mounted() {
        this.$nextTick(() => {
            if (this.userIsLoggedIn && this.siteBannerHasContent()) {
                this.createBanner()
            }
        })
    },
    destroyed() {
        this.componentIsDestroyed = true
    }
}
</script>

<style lang="scss" scoped>

.banner-container {
    background: get-color("silver");
    font-size: 20px;
    padding-bottom: 7px;
    padding-top: 7px;
}

.text-container {
    width: 85%;
    @include center-margin();
}

.close-banner-icon {
    position: absolute;
    left: 10px;
    color: get-color("dark-red");

    &:hover {
        color: get-color("red");
        cursor: pointer;
    }
}

@media screen and (max-width: $phone-width) {
    .banner-container {
        background: get-color("silver");
        font-size: 18px;
    }

}

@media screen and (min-width: $large-screen-view) {
    .banner-container {
        background: get-color("silver");
        font-size: 20px;
        padding-bottom: 10px;
        padding-top: 10px;
    }

}

</style>
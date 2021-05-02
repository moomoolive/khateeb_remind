<template>
    <div class="banner-container">
        <transition name="fade">
            <span v-show="showMsg">
                {{ currentlyDisplayedMsg }}
            </span>
        </transition>
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
            currentlyDisplayedMsg: ''
        }
    },
    methods: {
        loopThroughMsgs() {
            if (this.displayIndex !== this.displayMsgs.length - 1)
                this.displayIndex++
            else
                this.displayIndex = 0
        },
        msgLoop() {
            const sevenSecondsInMilliseconds = 7_000
            const loop = window.setInterval(() => {
                if (this.componentIsDestroyed)
                    window.clearInterval(loop)
                else
                    this.loopThroughMsgs()
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
            const todayIsFriday = new Date().getDay() === 5
            if (todayIsFriday)
                this.displayMsgs = this._utils.deepCopy(this.defaultDisplayMsgs.friday)
        }
    },
    computed: {
        userIsLoggedIn() {
            return this.$store.getters['user/isLoggedIn']
        }
    },
    watch: {
        userIsLoggedIn(newVal) {
            if (newVal && this.siteBannerHasContent())
                this.createBanner()    
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
    },
    mounted() {
        this.$nextTick(() => {
            if (this.userIsLoggedIn && this.siteBannerHasContent())
                this.createBanner()
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
    font-size: 18px;
    padding-bottom: 3px;
    padding-top: 3px;
    height: 24px;
}

</style>
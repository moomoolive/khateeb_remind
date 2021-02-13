<template>
    <div class="banner-container">
        {{ currentlyDisplayedMsg }}
    </div>
</template>

<script>
export default {
    name: "websiteBanner",
    data() {
        return {
            displayMsgs: [
                "🎉 اليوم يوم الجمعة 🎉",
                "🎉 Today is Friday 🎉"
            ],
            displayIndex: 0,
            componentIsDestroyed: false
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
                this.$store.dispatch('hideSiteBanner')
                this.componentIsDestroyed = true
            }, closeAfter)
        }
    },
    computed: {
        currentlyDisplayedMsg() {
            return this.displayMsgs[this.displayIndex]
        }
    },
    created() {
        this.msgLoop()
        this.scheduleBannerHiding()
    }
}
</script>

<style lang="scss" scoped>
.banner-container {
    background: getColor("silver");
    font-size: 18px;
    padding-bottom: 3px;
    padding-top: 3px;
    height: 24px;
}
</style>
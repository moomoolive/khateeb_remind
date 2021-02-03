<template>
    <div>
        <div class="topAnchor">
            <div class="close-notification-container">
                <span @click="close()">Close</span>
            </div>
        </div>
        <div :class="`content ${notificationInfo.options.color || 'yellow'}`">
            <component
                :is="notificationInfo.type"
                :options="notificationInfo.options"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "notificationsMain",
    components: {
        'alert': () => import('./types/alert.vue'),
        'redirect': () => import('./types/redirect.vue'),
        'confirm': () => import('./types/confirm.vue'),
        'notificationScroller': () => import('./types/notification-scroller.vue')
    },
    methods: {
        close() {
            this.$store.dispatch('closeNotification')
        }
    },
    computed: {
        notificationInfo() {
            return this.$store.state.notifications
        }
    },
    mounted() {
        this.$nextTick(async () => {
            if (this.notificationInfo.options._id) {
                this.$store.dispatch('markNotificationAsSeen', this.notificationInfo.options._id)
                const updated = await this.$API.user.markNotificationAsSeen({ _id: this.notificationInfo.options._id })
            }
        })
    }
}
</script>

<style lang="scss" scoped>

.topAnchor {
    margin-bottom: 0;
    max-height: 40px;
    height: 5vh;
    background-color: darken(getColor("silver"), 7%);
}

.close-notification-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.content {
    max-height: 10000px;
}

.green {
        background: themeRGBA("green", 0.88);
}

.red {
        background: themeRGBA("red", 0.88);
}

.yellow {
        background: themeRGBA("yellow", 0.88);
}

.blue {
    background: themeRGBA("blue", 0.88);
}

.grey {
    background: themeRBGA("grey", 0.88)
}

span {
    margin: 0;
    padding: 1px 2px 1px 2px;
    position: absolute;
    border-radius: 3px;
    color: getColor("grey");
    font-weight: bold;
    font-size: 19px;
    cursor: default;
}

@media screen and (max-width: $phoneWidth) {
    span {
        font-size: 2.5vh;
    }
}
</style>
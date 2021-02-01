<template>
    <div class="notifications-container">
        <div class="topAnchor">
            <span @click="close()">Close</span>
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
        'confirm': () => import('./types/confirm.vue')
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
    }
}
</script>

<style lang="scss" scoped>

.topAnchor {
    margin-bottom: 0;
    height: 13%;
    background-color: getColor("silver");
}

.content {
    overflow: auto;
    max-height: 10000px;
}

.green {
        background: themeRGBA("green", 0.75);
}

.red {
        background: themeRGBA("red", 0.75);
}

.yellow {
        background: themeRGBA("yellow", 0.55);
}

span {
    margin: 0;
    padding: 1px 2px 1px 2px;
    text-align: left;
    position: absolute;
    top: 2.3%;
    left: 2.7%;
    border-radius: 3px;
    color: getColor("offWhite");
    background-color: getColor("red");
    font-weight: bold;
    font-size: inherit;
    cursor: default;
}
</style>
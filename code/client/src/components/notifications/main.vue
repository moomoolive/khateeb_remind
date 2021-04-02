<template>
    <div>
        <div class="topAnchor">
            <div class="close-notification-container" @click="close()">
                <span>{{ this.notificationInfo.type === 'confirm' ? 'Cancel' : 'Close' }}</span>
            </div>
        </div>
            <div :class="`content ${notificationInfo.options.color || 'yellow'}`">
                <component
                    :is="notificationInfo.type"
                    :options="notificationInfo.options"
                    @close="close()"
                />
            </div>
    </div>
</template>

<script>
import notificationScroller from './types/notification-scroller.vue'
import redirect from './types/redirect.vue'
import confirm from './types/confirm.vue'
import tutorial from './types/tutorial.vue'
import alert from './types/alert.vue'

export default {
    name: "notificationsMain",
    components: {
        'alert': alert,
        'redirect': redirect,
        'confirm': confirm,
        'notificationScroller': notificationScroller,
        "tutorial": tutorial,
    },
    methods: {
        close() {
            if (this.notificationInfo.type === 'confirm')
                this.notificationInfo.options.reject(false)
            this.$store.commit('notifications/close')
        },
        keyBinds($event) {
            if ($event.key === "Escape")
                this.close()
        }
    },
    computed: {
        notificationInfo() {
            return this.$store.state.notifications.display
        }
    },
    created() {
        window.addEventListener('keyup', this.keyBinds)
    },
    destroyed() {
        window.removeEventListener('keyup', this.keyBinds)
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
    max-height: 500px;
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
    background: themeRGBA("grey", 0.88)
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
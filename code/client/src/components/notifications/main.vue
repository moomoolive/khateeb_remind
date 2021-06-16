<template>

    <div v-on-clickaway="close">
        
        <button class="top-anchor silver" @click="close()">
            {{ this.notificationInfo.type === 'confirm' ? 'Cancel' : 'Close' }}
        </button>

        <div :class="`content ${notificationInfo.options.color || 'yellow'}-background`">
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

import { mixin as clickaway } from 'vue-clickaway'

export default {
    name: "notificationsMain",
    components: {
        'alert': alert,
        'redirect': redirect,
        'confirm': confirm,
        'notificationScroller': notificationScroller,
        "tutorial": tutorial,
    },
    mixins: [clickaway],
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

.top-anchor {
    margin: 0 0 0 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    height: 40px;
    color: black;
    width: 100%;
}

.close-notification-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

span {
    cursor: pointer;
}

.content {
    max-height: 500px;
}

.green-background {
        background: get-color("green", 0.88);
}

.red-background {
        background: get-color("red", 0.88);
}

.yellow-background {
        background: get-color("yellow", 0.88);
}

.blue-background {
    background: get-color("blue", 0.88);
}

.grey-background {
    background: get-color("grey", 0.88)
}

span {
    margin: 0;
    padding: 1px 2px 1px 2px;
    position: absolute;
    border-radius: 3px;
    font-weight: bold;
    font-size: 18px;
    cursor: default;
}

</style>
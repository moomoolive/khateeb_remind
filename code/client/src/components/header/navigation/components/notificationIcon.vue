<template>
    <div>
        <fa-icon 
            :icon="['fas', showingNotificationScroller ? 'envelope-open' : 'envelope']" 
            :class="`menu-icon-svg${showingNotificationScroller ? ' active' : ''}`"
            @click="showingNotificationScroller ? 
                $store.commit('notifications/close') :
                openNotifications()
            "
        />
    </div>
</template>

<script>
export default {
    name: "notificationIcon",
    data() {
        return {
            alertAboutUrgent: false,
            colorHEXCodes: {
                blue: '#2196F3',
                yellow: '#F3C620'
            }
        }
    },
    methods: {
        vibrateIfApplicable() {
            const fiveSeconds = 5_000
            return window.setTimeout(() => { this.alertAboutUrgent = true }, fiveSeconds)
        },
        openNotifications() {
            const options = {
                type: 'notificationScroller',
                options: {
                    color: 'grey'
                }
            }
            this.$emit('close-nav')
            this.$store.dispatch('notifications/create', options)
        }
    },
    computed: {
        notificationsIconColor() {
            if (this.alertUserAboutUrgentNotifications)
                return this.colorHEXCodes.yellow
            else if (this.showingNotificationScroller)
                return this.colorHEXCodes.blue
            else
                return 'currentColor'
        },
        urgentNotificationsPresent() {
            return this.$store.getters['notifications/urgent'].length > 0
        },
        alertUserAboutUrgentNotifications() {
            return this.alertAboutUrgent && this.urgentNotificationsPresent && !this.notificationOnScreen
        },
        notificationOnScreen() {
            return this.notificationInfo.show
        },
        notificationInfo() {
            return this.$store.state.notifications.display
        },
        showingNotificationScroller() {
            return this.notificationInfo.show && this.notificationInfo.type === 'notificationScroller'
        },
        vibrateNotificationsIcon() {
            return this.alertUserAboutUrgentNotifications ? 'vibrate' : ''
        }
    },
    created() {
        this.vibrateIfApplicable()
    }
}
</script>

<style lang="scss" scoped>
@keyframes vibrate {
  0%, 2%, 4%, 6%, 8%, 10%, 12%, 14%, 16%, 18% {
    -webkit-transform: translate3d(-1px, 0, 0);
            transform: translate3d(-1px, 0, 0);
  }
  1%, 3%, 5%, 7%, 9%, 11%, 13%, 15%, 17%, 19% {
    -webkit-transform: translate3d(1px, 0, 0);
            transform: translate3d(1px, 0, 0);
  }
  20%, 100% {
    -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
  }
}

svg {
  height: 35px;
  margin-top: 4px;
  margin-left: 7px;
  margin-right: 7px;
  &.vibrate {
    -webkit-animation: vibrate 5s cubic-bezier(.36, .07, .19, .97) infinite;
    animation: vibrate 5s cubic-bezier(.36, .07, .19, .97) infinite;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-perspective: 300px;
    perspective: 300px;
  }
}
</style>
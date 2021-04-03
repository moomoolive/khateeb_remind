<template>
    <div>
        
        <svg
            @click="$store.commit('notifications/close')"
            v-show="showingNotificationScroller"
            aria-hidden="true" 
            focusable="false" 
            data-prefix="fas" 
            data-icon="envelope-open-text" 
            class="notifications svg-inline--fa fa-envelope-open-text fa-w-16" 
            role="img" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512"
        >
            <path 
                :fill="notificationsIconColor" 
                d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.13c-16.42 0-32.84-5.06-46.86-15.19L0 250.86V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V250.86L302.86 401.94c-14.02 10.12-30.44 15.19-46.86 15.19zm237.61-254.18c-8.85-6.94-17.24-13.47-29.61-22.81V96c0-26.51-21.49-48-48-48h-77.55c-3.04-2.2-5.87-4.26-9.04-6.56C312.6 29.17 279.2-.35 256 0c-23.2-.35-56.59 29.17-73.41 41.44-3.17 2.3-6 4.36-9.04 6.56H96c-26.51 0-48 21.49-48 48v44.14c-12.37 9.33-20.76 15.87-29.61 22.81A47.995 47.995 0 0 0 0 200.72v10.65l96 69.35V96h320v184.72l96-69.35v-10.65c0-14.74-6.78-28.67-18.39-37.77z">
                </path>
        </svg>
        
        <svg
            @click="openNotifications()" 
            v-show="!showingNotificationScroller"
            aria-hidden="true" 
            focusable="false" 
            data-prefix="fas" 
            data-icon="envelope" 
            :class="`notifications ${vibrateNotificationsIcon} svg-inline--fa fa-envelope fa-w-16`" 
            role="img" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512"
        >
            <path 
                :fill="notificationsIconColor" 
                d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z">
                </path>
        </svg>

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
            else if (this.notificationOnScreen)
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
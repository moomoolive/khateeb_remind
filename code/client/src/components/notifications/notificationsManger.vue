<template>
    <div></div>
</template>

<script>
export default {
    name: 'notificationsManager',
    data() {
        return {
            firstNotification: true,
            showedUnseenNotifications: false
        }
    },
    methods: {
        displayNotificationOnScreen(info) {
            return window.setTimeout(() => { this.$store.commit('notifications/display', info) }, this.notificationDisplaySpeed)
        },
        toggleNotificationDisplay() {
            const threeTenthsOfASecondInMilliSeconds = 300
            window.setTimeout(() => { this.$emit('toggle-notification-display') }, threeTenthsOfASecondInMilliSeconds)
        },
        async markNotificationAsSeen(_id) {
            const updated =  await this.$API.user.updateNotification({ _id, seen: true })
            this.$store.dispatch('notifications/updateOne', updated)
        },
        defaultServerNotification(notification) {
            return {
                type: 'alert',
                options: {
                    textSize: 'small',
                    icon: 'asalam',
                    msg: notification.msg,
                    _id: notification._id,
                    notificationOrigin: 'server',
                    color: 'green'
                }
            }
        },
        adjustNotificationBasedOnTag(notification) {
            let obj = {}
            switch(notification.tag) {
                case 'welcome':
                    return {
                        icon: 'asalam',
                        graphicType: 'gif'
                    }
                case 'khateebs':
                    obj.icon = "khateebs"
                    if (notification.meta && notification.meta.dropout)
                        obj.color = 'yellow'
                    return obj
                case 'jummah':
                    return {
                        type: 'redirect',
                        redirections: [
                            {
                                to: notification.actionLink.replace("__ID__", notification._id),
                                text: 'confirm'
                            }
                        ]
                    }
                default:
                    return {}
            }
        },
        createFinalVersionOfNotification(preppedNotification, originalNotification) {
            const changes = this.adjustNotificationBasedOnTag(originalNotification)
            const original = { ...preppedNotification }
            if (changes.type !== undefined) {
                original.type = changes.type
                delete changes.type
            }
            return { type: original.type, options: { ...original.options, ...changes } }
        },
        createClientReadyNotification(originalNotification) {
            const preppedNote = this.defaultServerNotification(originalNotification)
            return this.createFinalVersionOfNotification(preppedNote, originalNotification)
        }
    },
    computed: {
        notificationsQueue() {
            return this.$store.state.notifications.queue
        },
        userPromptedNotifications() {
            return this.$store.state.notifications.userPrompted
        },
        currentNotificationInfo() {
            return this.$store.state.notifications.display
        },
        showNotification() {
            return this.currentNotificationInfo.show
        },
        notificationDisplaySpeed() {
            const speedInMilliseconds = this.firstNotification ? 100 : 1_500
            return speedInMilliseconds
        },
        currentNotificationId() {
            return this.currentNotificationInfo.options._id
        },
        currentNotificationIsFromServer() {
            return !!this.currentNotificationId
        },
        unseenNotifications() {
            return this.$store.getters['notifications/unseen']
        }
    },
    watch: {
        notificationsQueue(newVal) {
            if (newVal.length < 1)
                return this.firstNotification = true
            let upcomingNotification = newVal[0]
            if (newVal[0] === '__USER__')
                upcomingNotification = this.userPromptedNotifications[0]
            this.displayNotificationOnScreen(upcomingNotification)
            this.firstNotification = false
        },
        async showNotification(newVal) {
            this.toggleNotificationDisplay()
            const notificationWasSeen = !newVal
            if (notificationWasSeen && this.currentNotificationIsFromServer)
                return this.markNotificationAsSeen(this.currentNotificationId)
        },
        unseenNotifications(newVal) {
            if (this.showedUnseenNotifications)
                return
            newVal.forEach(note => {
                const finalNote = this.createClientReadyNotification(note)
                this.$store.dispatch('notifications/create', finalNote)
            })
            this.showedUnseenNotifications = true
        }
    }
}
</script>
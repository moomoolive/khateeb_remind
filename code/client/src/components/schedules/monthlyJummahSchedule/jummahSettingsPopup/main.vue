<template>
    <div>
        <div>
            <div class="jummah-settings-title">
                Jummah Options
            </div>
            <div class="settings-label">
                {{ info.location.name }} @  {{ timingDisplay() }}
            </div>
            <div class="settings-label">
                {{ dateDisplay() }}
            </div>
        </div>
        <div class="action-buttons-container">
            <div v-if="viewingWeekIsCurrentPastOrFuture === 'current'">
                <div v-if="reciever === 'institutionAdmin'">
                    <button
                        :disabled="!mainKhateebIsScheduled || oneKhateebNotified" 
                        class="blue"
                        @click="runNotificationLoop()"
                    >
                        {{ info.khateebPreferences[0].notified ? 'Already Notified' : 'Notify Main Khateeb' }}
                    </button>
                    <button
                        :disabled="!backupKhateebIsScheduled || oneKhateebNotified" 
                        class="red" 
                        @click="runNotificationLoop(true)"
                    >
                        {{ info.khateebPreferences[1].notified ? 'Already Notified' : 'Notify Backup' }}
                    </button>
                    <button 
                        :disabled="!jummahHasData || !oneKhateebNotified" 
                        class="yellow" 
                        @click="resetNotifications()"
                    >
                        {{ jummahHasData ? !oneKhateebNotified ? 'None Notified' : 'Reset Notifications' : 'No Khateebs' }}
                    </button>
                </div>
                <div v-else-if="reciever === 'khateeb'">
                    <button 
                        class="blue"
                        :disabled="$store.getters['user/type'] !== 'khateeb'"
                        @click="utils.alert('Feature coming soon isa!')" 
                    >
                        Sign up for this Jummah
                    </button>
                </div>
            </div>
            <div v-else>
                No options available ⚙️
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "jummahSettingsPopup",
    props: {
        reciever: {
            type: String,
            required: true
        },
        info: {
            type: Object,
            required: true
        },
        selectedDate: {
            type: Date,
            required: true
        },
        viewingWeekIsCurrentPastOrFuture: {
            type: String,
            required: true
        }
    },
    methods: {
        dateDisplay() {
            const date = new Date(this.selectedDate)
            const month = date.toLocaleString('en-US', { month: 'long' })
            return `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
        },
        timingDisplay() {
            const date = new Date()
            date.setHours(this.info.timing.hour, this.info.timing.minute, 0, 0)
            return date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit' })
        },
        closePopup() {
            return this.$emit('close')
        },
        runNotificationLoop(isBackup=false) { 
            if (this.info.khateebPreferences[isBackup ? 1 : 0].notified)
                return this.utils.alert(`Khateeb has already been notified. Click 'Reset Notifications' to allow another notification to be sent.`)
            this.$emit("run-notification-loop", { isBackup, main: this.info.khateebPreferences[0], backup: this.info.khateebPreferences[1] })
            return this.closePopup()
        },
        resetNotifications() {
            this.scheduledKhateebs.forEach(p => {
                this.$emit('clear-notifications', { _id: p._id, notified: false, notificationID: 'none', isGivingKhutbah: !p.isBackup })
            })
            this.closePopup()
        }
    },
    computed: {
        jummahHasData() {
            return this.mainKhateebIsScheduled || this.backupKhateebIsScheduled
        },
        mainKhateebIsScheduled() {
            return this.info.khateebPreferences[0].createdAt
        },
        backupKhateebIsScheduled() {
            return this.info.khateebPreferences[1].createdAt
        },
        oneKhateebNotified() {
            return this.info.khateebPreferences.find(p => p.notified)
        },
        scheduledKhateebs() {
            return this.info.khateebPreferences.filter(p => p.createdAt)
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    color: getColor("offWhite");
    font-size: 17px;
    &.settings-label {
        padding-bottom: 7px;
        text-align: left;
        margin-left: 7px;
    }
    &.jummah-settings-title {
        padding-bottom: 10px;
        font-size: 20px;
        text-decoration: underline;
    }
}

.action-buttons-container {
    margin-top: 10px;
}

button {
    width: 210px;
    font-size: 16px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
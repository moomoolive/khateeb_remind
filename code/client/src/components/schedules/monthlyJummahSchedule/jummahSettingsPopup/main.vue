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

        <div v-if="notificationRunCountExceeded" class="settings-label center">
            <span class="red">
                You've reached the maximum amount of times 
                you can notify khateebs at 
                {{ maxNotificationLoopRunCount? "your institution" : "this jummah" }} this week
            </span>
        </div>

        <div class="action-buttons-container">
                
            <div v-if="reciever === 'institutionAdmin'">
                <button
                    :disabled="!mainKhateebIsScheduled || oneKhateebNotified || notificationRunCountExceeded" 
                    class="blue"
                    @click="runNotificationLoop()"
                >
                    {{ info.khateebPreferences[0].notified ? 'Already Notified' : 'Notify Main Khateeb' }}
                </button>
                <button
                    :disabled="!backupKhateebIsScheduled || oneKhateebNotified || notificationRunCountExceeded" 
                    class="red" 
                    @click="runNotificationLoop(true)"
                >
                    {{ info.khateebPreferences[1].notified ? 'Already Notified' : 'Notify Backup' }}
                </button>
                <button 
                    :disabled="!jummahHasData || !oneKhateebNotified || notificationRunCountExceeded" 
                    class="yellow" 
                    @click="resetNotifications()"
                >
                    {{ jummahHasData ? !oneKhateebNotified ? 'None Notified' : 'Reset Notifications' : 'No Khateebs' }}
                </button>
            </div>

            <div v-else-if="reciever === 'khateeb'">
                <button 
                    class="blue"
                    :disabled="mainKhateebIsScheduled || !currentUserIsAvailableForJummah"
                    @click="signupKhateeb(false)" 
                >
                    {{ mainKhateebIsScheduled ? "Already Filled" : "Sign up as Main Khateeb"}}
                </button>
                <button 
                    class="red"
                    :disabled="backupKhateebIsScheduled || !currentUserIsAvailableForJummah"
                    @click="signupKhateeb(true)" 
                >
                    {{ backupKhateebIsScheduled ? "Already Filled" : "Sign up as Backup"}}
                </button>
            </div>

            <div v-else>
                No options available ⚙️
            </div>

        </div>
    </div>
</template>

<script>
import jummahHelpers from '@/libraries/jummahs/main.js'

import Config from '$config'

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
        },
        maxNotificationLoopRunCount: {
            type: Boolean,
            required: true
        },
        khateebsavailableForSelectedWeek: {
            type: Array,
            required: true
        }
    },
    methods: {
        signupKhateeb(isBackup=false) {
            if (this.currentUserIsAlreadySignedUpForThisJummah)
                return this._utils.alert(`You're already signed up for this jummah!`)
            this.$emit('khateeb-signup', {
                date: jummahHelpers.fridayToFridayDBFormat(new Date(this.selectedDate)),
                timingID: this.info.timing._id,
                locationID: this.info.timing.locationID,
                institutionID: this.info.timing.institutionID,
                isBackup,
                isGivingKhutbah: !isBackup,
                khateebID: this.currentUser,
                notified: false,
                notificationID: this._config.nullId,
                maxRunCount: Config.userRestrictionsConfig.notificationLoopMaxRunCountPerJummah
            })
            return this.closePopup()
        },
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
            const target = this.getTargetPreference(isBackup) 
            if (target.notified)
                return this._utils.alert(`Khateeb has already been notified. Click 'Reset Notifications' to allow another notification to be sent.`)
            this.$emit("run-notification-loop", { isBackup, main: this.info.khateebPreferences[0], backup: this.info.khateebPreferences[1] })
            return this.closePopup()
        },
        resetNotifications() {
            this.scheduledKhateebs.forEach(p => {
                const meta = { ...p.meta }
                delete meta.jummahRef
                this.$emit(
                    'clear-notifications', 
                    { 
                        _id: p._id, 
                        notified: false, 
                        notificationID: this._config.nullId, 
                        isGivingKhutbah: !p.isBackup,
                        meta
                    }
                )
            })
            return this.closePopup()
        },
        getTargetPreference(isBackup=false) {
            return this.info.khateebPreferences[isBackup ? 1 : 0]
        }
    },
    computed: {
        jummahHasData() {
            return this.mainKhateebIsScheduled || this.backupKhateebIsScheduled
        },
        mainKhateebIsScheduled() {
            return this.info.khateebPreferences[0].khateebID && this.info.khateebPreferences[0].khateebID !== 'none'
        },
        backupKhateebIsScheduled() {
            return this.info.khateebPreferences[1].khateebID && this.info.khateebPreferences[1].khateebID !== 'none'
        },
        oneKhateebNotified() {
            return this.info.khateebPreferences.find(p => p.notified)
        },
        scheduledKhateebs() {
            return this.info.khateebPreferences.filter(p => p.createdAt)
        },
        currentUser() {
            return this.$store.state.user.userInfo._id
        },
        currentUserKhateebInfo() {
            return this.khateebsavailableForSelectedWeek.find(k => k._id === this.currentUser)
        },
        currentUserIsAlreadySignedUpForThisJummah() {
            return this.info.khateebPreferences.find(kp => kp.khateebID === this.currentUser)
        },
        notificationLoopRunCount() {
            const runCount = this.info.khateebPreferences.find(p => p.loopRunCount)
            return runCount ? runCount.loopRunCount : 0
        },
        notificationRunCountExceeded() {
            return this.notificationLoopRunCount > this.maxRunCount || this.maxNotificationLoopRunCount
        },
        currentUserIsAvailableForJummah() {
            if (this.reciever !== 'khateeb')
                return false
            else if (!this.currentUserKhateebInfo)
                return false
            else if (this.currentUserKhateebInfo.availableTimings.length < 1)
                return true
            else
                return this.currentUserKhateebInfo.availableTimings.find(t => t === this.info.timing._id)
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    color: get-color("off-white");
    font-size: 17px;
    &.settings-label {
        padding-bottom: 7px;
        text-align: left;
        margin-left: 7px;

        &.center {
            text-align: center;
        }
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
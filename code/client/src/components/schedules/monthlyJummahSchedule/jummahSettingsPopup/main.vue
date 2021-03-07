<template>
    <div v-if="readyToShow">
        <div>
            <div class="jummah-settings-title">
                Extra Jummah Options
            </div>
            <div class="settings-label">
                {{ info.location.name }} @  {{ timingDisplay(info.timing) }}
            </div>
            <div class="settings-label">
                {{ dateDisplay(info.jummah.date) }}
            </div>
        </div>
        <div class="action-buttons-container">
            <div v-if="reciever === 'institutionAdmin'">
                <button class="purple" @click="sendNotifications()">
                    Send Notifications Now
                </button>
                <button class="yellow" @click="manualOverride(!info.jummah.confirmed)">
                    Manual {{ info.jummah.confirmed ? 'Unconfirm' : 'Confirm' }}
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
        }
    },
    methods: {
        dateDisplay(jummahDate) {
            const date = new Date(jummahDate)
            const month = date.toLocaleString('en-US', { month: 'long' })
            return `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
        },
        timingDisplay(jummahTiming) {
            const date = new Date()
            date.setHours(jummahTiming.hour, jummahTiming.minute, 0, 0)
            return date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit' })
        },
        async sendNotifications() {
            const confirm = await this.utils.confirm(`Are you sure you want to send notifications now?`)
            if (confirm)
                this.$emit('run-notification-loop', this.info.jummah)
            this.closePopup()
        },
        async manualOverride(jummahIsConfirmed) {
            const confirm = await this.utils.confirm(`Manual confirm will assume that the first khateeb confirmed their attendance and Khateeb Remind will not send any further notifications for this jummah. Are you sure you want to manual confirm?`)
            if (confirm)
                this.$emit('override-jummah', this.override(jummahIsConfirmed))
            this.closePopup()
        },
        override(confirm=true) {
            const copy = this.unconfirmAllPrayerSlots({ ...this.info.jummah })
            if (confirm) {
                copy.khateebPreference[0].confirmed = confirm
                copy.khateebPreference[0].notified = confirm
                copy.khateebPreference[0].responded = confirm
            }
            copy.confirmed = confirm
            return copy
        },
        unconfirmAllPrayerSlots(jummahCopy) {
            jummahCopy.khateebPreference.forEach(preference => {
                preference.confirmed = false
                preference.notified = false
                preference.responded = false
            })
            return jummahCopy
        },
        closePopup() {
            this.$emit('close')
        }
    },
    computed: {
        readyToShow() {
            return Object.keys(this.info).length > 0
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    color: getColor("offWhite");
    &.settings-label {
        padding-bottom: 7px;
        font-size: 17px;
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
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
                    <button class="purple">Send Notifications Now</button>
                    <button class="yellow">Reset Notifications</button>
                    <button class="red">Message Backup</button>
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
            this.$emit('close')
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
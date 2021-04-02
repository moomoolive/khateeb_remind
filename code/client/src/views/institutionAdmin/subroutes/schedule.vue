<template>
    <div>

        <div>
            <button
                class="purple to-locations-timings-button"
                @click="$router.push('/institutionAdmin/locations-and-timings')"
            >
                {{ locations.length > 0 ? "Edit Locations and Timings" : "Create First Location" }}
            </button>
        </div>

        <monthly-jummah-schedule
            :jummahs="jummahs"
            :locations="locations"
            :timings="timings"
            :khateebs="khateebs"
            :reciever="viewingMode"
            @request-jummahs="requestJummahs($event)"
            @new-preference="createNewJummahPreference($event)"
            @update-preference="updateJummahPreference($event)"
            @run-notification-loop="runNotificationLoop($event)"
            @khateeb-signup="utils.alert('This feature is only available to khateebs!')"
        >
            <template #above-controls>
                <div>
                    
                    <div 
                        v-if="institutionSettings.allowJummahNotifications" 
                        class="notification-time-container"
                    >
                        <button class="notification-time-button turquoise" @click="chronInfo()">
                            ⏰ {{ chronTiming() }}
                        </button>
                    </div>

                    <div class="viewing-mode-container">
                        <div class="select-text">
                            Viewing Mode
                        </div>
                        <select v-model="viewingMode" class="viewing-mode-dropdown">
                            <option value="institutionAdmin">Admin</option>
                            <option value="khateeb">Khateeb</option>
                        </select>
                    </div>

                </div>
            </template>
        </monthly-jummah-schedule>

    </div>
</template>

<script>
import monthlyJummahSchedule from '@/components/schedules/monthlyJummahSchedule/main.vue'

import timingHelpers from '@/libraries/timings/main.js'

export default {
    name: "scheduleSetter",
    components: {
        monthlyJummahSchedule
    },
    data() {
        return {
            jummahs: [],
            locations: [],
            timings: [],
            khateebs: [],
            viewingMode: 'institutionAdmin',
            institutionSettings: {}
        }
    },
    methods: {
        chronInfo() {
            return this.utils.alert(
                `Khateeb remind sends notifications to all your scheduled khateebs on ${this.chronTiming('long')}. If you want to change the scheduled time or turn off notifications you can do so by heading to settings.`,
                "success",
                { icon: "clock-no-markings" }
            )
        },
        async getScheduleBuildingBlocks() {
            const [locations, timings, khateebs, { settings }] = await this.$API.chainedRequests.getScheduleComponents()
            this.locations = locations
            this.timings = timings
            this.khateebs = khateebs
            this.institutionSettings = settings
        },
        async createNewJummahPreference(newPreference={}) {
            const newJummahPreference = await this.$API.jummahs.createNewJummahPreference(newPreference)
            if (Object.keys(newJummahPreference).length > 0)
                this.jummahs.push(newJummahPreference)
        },
        async requestJummahs(jummahDateRange) {
            this.jummahs = await this.$API.jummahs.getJummahs({ date: jummahDateRange })
        },
        findJummahIndexById(id) {
            return this.jummahs.findIndex(jummah => jummah._id === id)
        },
        async updateJummahPreference(updatedJummah={}) {
            const updated = await this.$API.jummahs.updateJummahPreference(updatedJummah)
            this.jummahs.splice(this.findJummahIndexById(updated._id), 1, updated)
        },
        fillIdIfEmpty(main={}, backup={}) {
            if (!main._id)
                main = { ...main, _id: 'none' }
            if (!backup._id)
                backup = { ...backup, _id: 'none' }
            return { main, backup }
        },
        async runNotificationLoop({ main: preprocessedMain, backup: preprocessedBackup, isBackup }) {
            const { main, backup } = this.fillIdIfEmpty(preprocessedMain, preprocessedBackup)
            const updatedPreferences = await this.$API.jummahs.runNotificationLoop({ main, backup }, isBackup)
            for (const [key, value] of Object.entries(updatedPreferences)) {
                if (value.upsert)
                    this.jummahs.push(value)
                else if (value._id && value._id !== 'none')
                    this.jummahs.splice(this.findJummahIndexById(value._id), 1, value)
            }
        },
        chronTiming(weekDayFormat="short") {
            const date = timingHelpers.chronTiming(this.institutionSettings.jummahNotificationsTiming)
            const dayOfWeek = date.toLocaleString('en-US', { weekday: weekDayFormat })
            const time = date.toLocaleString('en-US', { minute: '2-digit', hour: 'numeric' })
            return `${dayOfWeek} @ ${time}`
        }
    },
    created() {
        this.getScheduleBuildingBlocks()
    }
}
</script>

<style lang="scss" scoped>
.viewing-mode-container {
    margin-left: auto;
    width: 53%;
    padding-bottom: 10px;
}

.notification-time-container {
    margin-right: auto;
    width: 59%;
}

.notification-time-button {
    font-size: 12px;
    border-radius: 99999px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
}

.select-text {
    font-size: 14px;
    padding-bottom: 5px;
    font-weight: bold;
}

.to-locations-timings-button {
    width: 200px;
    font-size: 13px;
    margin-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.viewing-mode-dropdown {
    width: 90px;
    height: 25px;
    font-size: 13px;
    color: getColor("offWhite");
    border: none;
    outline: none;
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    border-radius: 4px;
}
</style>
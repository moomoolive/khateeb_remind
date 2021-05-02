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
            @khateeb-signup="_utils.alert('This feature is only available to khateebs!')"
        >
            <template #above-controls>

                <div class="extra-controls-container">
                    
                    <div class="notification-time-container">
                        <button 
                            :class="`notification-time-button ${ !institutionSettings.allowJummahNotifications ? 'yellow' : 'turquoise'}`" 
                            @click="$router.push({ path: '/institutionAdmin/settings', query: { click: 'chron-timing' } })"
                        >
                            ⏰ {{ institutionSettings.allowJummahNotifications ? chronTiming() : 'No Notifications' }}
                        </button>
                    </div>

                    <div class="viewing-mode-container">
                        <div>
                            <div class="select-text">
                                Viewing Mode
                            </div>
                            <select v-model="viewingMode" class="viewing-mode-dropdown">
                                <option value="institutionAdmin">Admin</option>
                                <option value="khateeb">Khateeb</option>
                            </select>
                        </div>
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
        async getScheduleBuildingBlocks() {
            const [locations, timings, khateebs, { settings }] = await this._api.chainedRequests.getScheduleComponents()
            this.locations = locations
            this.timings = timings
            this.khateebs = khateebs
            this.institutionSettings = settings
        },
        async createNewJummahPreference(newPreference={}) {
            const newJummahPreference = await this._api.jummahs.createNewJummahPreference(newPreference)
            if (Object.keys(newJummahPreference).length > 0)
                this.jummahs.push(newJummahPreference)
        },
        async requestJummahs(jummahDateRange) {
            this.jummahs = await this._api.jummahs.getJummahs({ date: jummahDateRange })
        },
        findJummahIndexById(id) {
            return this.jummahs.findIndex(jummah => jummah._id === id)
        },
        async updateJummahPreference(updatedJummah={}) {
            const updated = await this._api.jummahs.updateJummahPreference(updatedJummah)
            this.jummahs.splice(this.findJummahIndexById(updated._id), 1, updated)
        },
        fillIdIfEmpty(main={}, backup={}) {
            if (!main._id)
                main = { ...main, _id: this._config.nullId }
            if (!backup._id)
                backup = { ...backup, _id: this._config.nullId }
            return { main, backup }
        },
        async runNotificationLoop({ main: preprocessedMain, backup: preprocessedBackup, isBackup }) {
            const { main, backup } = this.fillIdIfEmpty(preprocessedMain, preprocessedBackup)
            const updatedPreferences = await this._api.jummahs.runNotificationLoop({ main, backup }, isBackup)
            // eslint-disable-next-line no-unused-vars
            for (const [_, value] of Object.entries(updatedPreferences)) {
                if (value.upsert)
                    this.jummahs.push(value)
                else if (value._id && value._id !== this._config.nullId)
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
.notification-time-container {
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.notification-time-button {
    font-size: 15px;
    border-radius: 99999px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
}

.select-text {
    font-size: 17px;
    padding-bottom: 5px;
    font-weight: bold;
}

.to-locations-timings-button {
    width: 300px;
    font-size: 17px;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 30px;
    @include floating-box-shadow();
}

.viewing-mode-dropdown {
    width: 120px;
    height: 30px;
    font-size: 15px;
    color: get-color("off-white");
    border: none;
    outline: none;
    background-color: get-color("grey", 1);
    &:focus {
        background-color: get-color("grey", 0.5);
    }
    border-radius: 4px;
}

.viewing-mode-container {
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.extra-controls-container {
    @include flexbox-default(column);
}

@media screen and (max-width: $phone-width) {
    
    .to-locations-timings-button {
        width: 200px;
        font-size: 13px;
    }

    .viewing-mode-container, .notification-time-container  {
        width: 77%;
    }

    .notification-time-button {
        font-size: 12px;
    }

    .viewing-mode-dropdown {
        width: 90px;
        height: 25px;
        font-size: 13px;
    }

    .select-text {
        font-size: 14px;
        padding-bottom: 5px;
    }
}
</style>
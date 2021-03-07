<template>
    <div>
        <!-- to locations and timings -->
        <div>
            <button @click="$router.push('/institutionAdmin/locations-and-timings')">
                Edit Locations and Timings
            </button>
        </div>
        <!-- ENDS HERE -->

        <!-- schedule -->
        <monthly-jummah-schedule
            :jummahs="jummahs"
            :locations="locations"
            :timings="timings"
            :khateebs="khateebs"
            :reciever="viewingMode"
            @request-jummahs="requestJummahs($event)"
            @build-schedule="buildSchedule($event, locations, timings)"
            @jummah-update="updateJummah($event)"
            @jummah-update-delay="updateJummahDelayedRequest($event)"
            @run-notification-loop="runNotificationLoop($event)"
        >
            <template #above-controls>
                <div class="viewing-mode-container">
                    <div class="select-text">
                        Viewing Mode
                    </div>
                    <select v-model="viewingMode" class="viewing-mode-dropdown">
                        <option value="institutionAdmin">Admin</option>
                        <option value="khateeb">Khateeb</option>
                    </select>
                </div>
            </template>
        </monthly-jummah-schedule>
        <!-- SCHEDULE ENDS HERE -->

    </div>
</template>

<script>
import monthlyJummahSchedule from '@/components/schedules/monthlyJummahSchedule/main.vue'

import jummahHelpers from '@/libraries/jummahs/main.js'

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
            viewingMode: 'institutionAdmin'
        }
    },
    methods: {
        async getScheduleBuildingBlocks() {
            try {
                const [locations, timings, khateebs] = await this.$API.chainedRequests.getScheduleComponents()
                this.locations = locations
                this.timings = timings
                this.khateebs = khateebs
            } catch(err) {
                console.log(err)
            }
        },
        async requestJummahs(jummahDateRange) {
            try {
                const { jummahs } = await this.$API.jummahs.getJummahs({ date: jummahDateRange })
                this.jummahs = jummahs
            } catch(err) {
                console.log(err)
            }
        },
        async buildSchedule(monthOfDateObj, locations, timings) {
            const jummahs = jummahHelpers.buildMonthlySchedule(monthOfDateObj, locations, timings, true)
            try {
                const databaseLoggedJummahs = await this.$API.jummahs.createNewJummahs(jummahs)
                this.jummahs = databaseLoggedJummahs || []
            } catch(err) {
                console.log(err)
            }
        },
        findJummahById(id) {
            return this.jummahs.findIndex(jummah => jummah._id === id)
        },
        async updateJummah(updatedJummah) {
            try {
                const updated = await this.$API.jummahs.updateJummah(updatedJummah)
                if (!updated)
                    return
                this.jummahs.splice(this.findJummahById(updated._id), 1, updated)
            } catch(err) {
                console.log(err)
            }
        },
        async runNotificationLoop(jummah) {
            console.log(jummah)
        },
        async updateJummahDelayedRequest(updatedJummah) {
            await this.utils.delayedRequest(
                'jummahs',
                'updateJummah',
                {
                    arguments: [updatedJummah],
                    additionalIdentifiers: ['setSchedule', updatedJummah._id]
                }
            )
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

.select-text {
    font-size: 14px;
    padding-bottom: 5px;
    font-weight: bold;
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
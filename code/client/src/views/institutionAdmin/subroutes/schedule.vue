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
            :reciever="`institutionAdmin`"
            @request-jummahs="requestJummahs($event)"
            @build-schedule="buildSchedule($event, locations, timings)"
        />
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
            khateebs: []
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
        }
        
    },
    created() {
        this.getScheduleBuildingBlocks()
    }
}
</script>

<style lang="scss" scoped>

</style>
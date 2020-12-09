<template>
    <div>
        <div v-if="!scheduleAvailable">
           {{ errorMsg }}
        </div>
        <div v-if="scheduleAvailable">
            <slider-button
            leftMessage="This Week"
            rightMessage="This Month"
            altText="Toggle between weekly and monthly view"
            @slider-toggled="isWeeklyView = !isWeeklyView"
            style="margin-top: 20px; margin-bottom: 20px;"
            />
            <div id="changeWeekButtons" class="whiteSpace">
                <div v-if="!isWeeklyView">
                    <button
                    v-for="(value, weekOf) in locationInfo[0].monthlySchedule"
                    :key="weekOf"
                    @click="displayData.weekOf = weekOf"
                    :aria-label="`view schedule for ${date.upComingFriday.month} ${weekOf}`"
                    >
                        {{ date.abbreviatedMonthName }} {{ weekOf }}
                    </button>
                </div>
            </div>
            <div id="changeLocationButtons" class="whiteSpace">
                <div>
                    <button
                    @click="displayData.location = 'All'"
                    aria-label="view schedule for all locations"
                    >
                        All locations
                    </button>
                    <button
                    v-for="(prayerLocationData, location_ID) in locationInfo"
                    :key="location_ID"
                    @click="displayData.location = location_ID"
                    :aria-label="`view schedule for ${prayerLocationData.info.name}`"
                    >
                        {{ prayerLocationData.info.name }}
                    </button>
                </div>
            </div>
            <div id="headers">
                <h3 style="margin-top: 0px; margin-bottom: 4px;">
                    {{ date.upComingFriday.month }} {{ displayData.weekOf }}, {{date.upComingFriday.year}}
                </h3>
            </div>
            <div id="scheduleTables">
                <table
                v-for="(prayerLocation, locationID) in shownLocations"
                :key="locationID"
                style="width: 95%;"
                >
                    <tr>
                        <th colspan="2">{{ prayerLocation.info.name }}</th>
                    </tr>
                    <tr>
                        <th v-for="columnNames in columnData" :key="columnNames">
                            {{columnNames}}
                        </th>
                    </tr>
                    <tr v-for="(khateeb, prayerTiming) in prayerLocation.monthlySchedule[displayData.weekOf]" :key="prayerTiming">
                        <th>
                            {{ `${prayerLocation.timing[prayerTiming].hour}:${prayerLocation.timing[prayerTiming].minutes}${prayerLocation.timing[prayerTiming].AMorPM}` }}
                        </th>
                        <th>{{ khateeb }}</th>
                    </tr>
                    <tr>
                        <th colspan="2">Location: {{ prayerLocation.info.address }}</th>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../utils/apiCalls.js'

export default {
    name: 'khateebScheduleDisplay',
    data() {
        return {
            date: {
                upComingFriday: this.$store.state.date.upcomingFriday,
                abbreviatedMonthName: this.$store.state.date.upcomingFriday.month.slice(0,3)
            },
            columnData: null,
            locationInfo: null,
            displayData: {
                location: 'All',
                weekOf: this.$store.state.date.upcomingFriday.date,
            },
            isWeeklyView: true,
            scheduleAvailable: true,
            errorMsg: null
        }
    },
    methods: {
        async getSchedule() {
            const monthlySchedule = await API.monthlySchedule()
            if (monthlySchedule === `This month's schedule hasn't been created yet`) {
                this.scheduleAvailable = false
                this.errorMsg = monthlySchedule
            } else {
                this.columnData = monthlySchedule.columnData
                this.locationInfo = monthlySchedule.rows
            }
        }
    },
    computed: {
        shownLocations() {
            const location = this.displayData.location
            if (location !== 'All') {
                return { location: this.locationInfo[location] }
            } else return this.locationInfo
        }
    },
    watch: {
        isWeeklyView(newValue) {
            if (newValue) {
                this.displayData.weekOf = this.date.upComingFriday.date
            }
        }
    },
    created() {
        this.getSchedule()
    }
}
</script>

<style lang="scss" scoped>
.whiteSpace {
    $size: 30px;
    height: $size;
    margin-bottom: $size;
}

table, th, td {
  border: 1px solid black;
}

table {
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
}

</style>
<template>
    <div>
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
                v-for="(value, weekOf) in khateebInfo.locationInfo.location1.monthlySchedule"
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
                @click="displayData.displayedLocation = 'All'"
                aria-label="view schedule for all locations"
                >
                    All locations
                </button>
                <button
                v-for="(prayerLocationData, location_IDs) in khateebInfo.locationInfo"
                :key="location_IDs"
                @click="displayData.displayedLocation = location_IDs"
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
            v-for="(prayerLocation, locationIDs) in shownLocations"
            :key="locationIDs"
            style="width: 95%;"
            >
                <tr>
                    <th colspan="2">{{ prayerLocation.info.name }}</th>
                </tr>
                <tr>
                    <th v-for="columnNames in khateebInfo.columnData" :key="columnNames">
                        {{columnNames}}
                    </th>
                </tr>
                <tr v-for="(khateeb, prayerTiming) in prayerLocation.monthlySchedule[displayData.weekOf]" :key="prayerTiming">
                    <th>{{ prayerLocation.timing[prayerTiming] }}</th>
                    <th>{{ khateeb }}</th>
                </tr>
                <tr>
                    <th colspan="2">Location: {{ prayerLocation.info.address }}</th>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'khateebScheduleDisplay',
    data() {
        return {
            date: {
                upComingFriday: this.$store.state.date.upcomingFriday,
                abbreviatedMonthName: this.$store.state.date.upcomingFriday.month.slice(0,3)
            },
            khateebInfo : {
                columnData: this.$store.state.khateebSchedule.columnData,
                locationInfo: this.$store.state.khateebSchedule.rows
            },
            displayData: {
                displayedLocation: 'All',
                weekOf: this.$store.state.date.upcomingFriday.date,
            },
            isWeeklyView: true
        }
    },
    computed: {
        shownLocations() {
            const location = this.displayData.displayedLocation
            if (this.displayData.displayedLocation !== 'All') {
                return { location: this.khateebInfo.locationInfo[location] }
            } else return this.khateebInfo.locationInfo
        }
    },
    watch: {
        isWeeklyView(newValue) {
            if (newValue) {
                this.displayData.weekOf = this.date.upComingFriday.date
            }
        }
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
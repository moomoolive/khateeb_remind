<template>
    <div>
        <div id="headers">
            <h4>
                Today's Date: {{ date.currentDate.dayOfTheWeek }}
                {{ date.currentDate.month }} {{ date.currentDate.date }}, {{date.currentDate.year}}
            </h4>
            <h2 v-if="!isWeekly">This Month's Khateeb Schedule</h2>
            <h2 v-if="isWeekly">This Week's Khateeb Schedule</h2>
            <h4>Schedule for: {{ date.month }} {{ date.day }}, {{date.year}}</h4>
        </div>
        <div id="changeWeekButtons" style="height: 15px; margin-bottom: 15px;">
            <div v-if="!isWeekly">
                <button
                v-for="(value, weekOf) in khateebInfo.locationInfo.location1.monthlySchedule"
                :key="weekOf"
                @click="date.day = weekOf"
                :aria-label="`button to view schedule for ${date.month} ${weekOf}`"
                >
                    {{ date.button }} {{ weekOf }}
                </button>
            </div>
        </div>
        <div id="changeLocationButtons" style="height: 15px; margin-bottom: 15px;">
            <div v-if="!isWeekly">
                <button
                @click="displayData.displayedLocation = 'All'"
                aria-label="button to view schedule for all locations"
                >
                    All locations
                </button>
                <button
                v-for="(prayerLocationData, location_IDs) in khateebInfo.locationInfo"
                :key="location_IDs"
                @click="displayData.displayedLocation = location_IDs"
                :aria-label="`button to view schedule for ${prayerLocationData.info.name}`"
                >
                    {{ prayerLocationData.info.name }}
                </button>
            </div>
        </div>
        <div id="scheduleTables">
            <table
            v-for="(prayerLocation, locationIDs) in shownLocations"
            :key="locationIDs"
            style="width: 100%;"
            >
                <tr>
                    <th colspan="2">{{ prayerLocation.info.name }}</th>
                </tr>
                <tr>
                    <th v-for="columnNames in khateebInfo.columnData" :key="columnNames">{{columnNames}}</th>
                </tr>
                <tr
                v-for="(rows, rowNumber) in prayerLocation.monthlySchedule[date.day]" 
                :key="rowNumber"
                >
                    <th v-for="rowData in rows" :key="rowData">{{ rowData }}</th>
                </tr>
                <tr>
                    <th colspan="2">
                        Location: {{ prayerLocation.info.address }}
                    </th>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'monthlyKhateebSchedule',
    props: {
        isWeekly: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            date: {
                month: this.$store.state.date.upcomingFriday.month,
                year: this.$store.state.date.upcomingFriday.year,
                button: this.$store.state.date.upcomingFriday.month.slice(0,3),
                day: this.$store.state.date.upcomingFriday.date,
                upComingFriday: this.$store.state.date.upcomingFriday.date,
                currentDate: {
                    date: this.$store.state.date.currentDate.date,
                    dayOfTheWeek: this.$store.state.date.currentDate.dayOfTheWeek,
                    month: this.$store.state.date.currentDate.month,
                    year: this.$store.state.date.currentDate.year
                }
            },
            khateebInfo : {
                columnData: this.$store.state.khateebSchedule.columnData,
                locationInfo: this.$store.state.khateebSchedule.rows
            },
            displayData: {
                displayedLocation: 'All'
            }
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
        isWeekly(newValue) {
            if (newValue) {
                this.date.day = this.date.upComingFriday
            }
        }
    }
}
</script>

<style scoped>
table {
    margin-top: 10px;
}


</style>
<template>
    <div style="padding-top: 20px;">
        set schedule<br>
        <h2 v-if="!initalized">You need to first create a locations and timings to start setting a schedule</h2>
        <div v-if="initalized">
            <div>
            <div id="changeWeekButtons" class="whiteSpace">
                <div>
                    <button
                    v-for="fridayDate of fridayDates"
                    :key="fridayDate"
                    @click="displayData.weekOf = fridayDate"
                    :aria-label="`view schedule for ${displayedMonthInfo.month} ${fridayDate}`"
                    >
                        {{ displayedMonthInfo.abbreviatedMonthName }} {{ fridayDate }}
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
                    v-for="(prayerLocationData, location_ID) in currentSchedule.data.rows"
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
                    <button @click="incrementMonth(1)">Add month</button>
                    {{ displayedMonthInfo.month }} {{ displayData.weekOf }}, {{ displayedMonthInfo.year }}
                    <button @click="incrementMonth(-1)">Less month</button>
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
                        <th v-for="columnNames in currentSchedule.data.columnData" :key="columnNames">
                            {{columnNames}}
                        </th>
                    </tr>
                    <tr v-for="(khateeb, prayerTiming) in prayerLocation.monthlySchedule[displayData.weekOf]" :key="prayerTiming">
                        <th>
                            {{ `${prayerLocation.timing[prayerTiming].hour}:${prayerLocation.timing[prayerTiming].minutes}${prayerLocation.timing[prayerTiming].AMorPM}` }}
                        </th>
                        <th>
                            <select 
                            v-model="currentSchedule.data.rows[locationID].monthlySchedule[displayData.weekOf][prayerTiming]" 
                            >
                                <option
                                v-for="(khateeb, khateebNumber) in khateebList" :key="khateebNumber"
                                :value="khateeb"
                                >
                                    {{ khateeb.firstName }} {{ khateeb.lastName }}
                                </option>
                                <option selected :value="emptyKhateeb">
                                    TBD
                                </option>
                            </select>
                            <button @click="revertToOriginal(locationID, prayerTiming)">Revert</button>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="2">Location: {{ prayerLocation.info.address }}</th>
                    </tr>
                </table>
            </div>
            <button @click="saveData" :disabled="isSame">save changes</button>
        </div>
    </div>
    </div>
</template>

<script>
import datetime from '../../utils/datetime.js'
import API from '../../utils/apiCalls.js'
import equal from 'fast-deep-equal'

export default {
    name: 'scheduleSetter',
    data() {
        return {
            month: new Date(),
            currentSchedule: null,
            originalSchedule: null,
            displayData: {
                location: 'All',
                weekOf: this.$store.state.date.upcomingFriday.date,
            },
            initalized: true,
            khateebList: null,
            emptyKhateeb: 'randomValue'
        }
    },
    methods: {
        incrementMonth(value) {
            const currentMonth = this.month.getMonth()
            const halfOfAMonth = 15
            while (this.month.getMonth() === currentMonth) {
                this.month = new Date(this.month.setDate(this.month.getDate() + (halfOfAMonth * value)))
            }
            this.$nextTick(async () => {
                this.fetchMonthlySchedule()
                this.displayData.weekOf = this.fridayDates[0]
            })
        },
        revertToOriginal(location, index) {
            const originalData = JSON.parse(JSON.stringify(this.originalSchedule.data.rows[location].monthlySchedule[this.displayData.weekOf][index]))
            this.currentSchedule.data.rows[location].monthlySchedule[this.displayData.weekOf].splice(index, 1, originalData)
        },
        updateSchedule(schedule) {
            this.currentSchedule = schedule
            this.cacheOriginalSchedule()
        },
        cacheOriginalSchedule() {
            this.originalSchedule = JSON.parse(JSON.stringify(this.currentSchedule))
        },
        saveData() {
            const toBeDecidedIndicator = 'TBD'
            if (window.confirm("Are you sure you want to save these changes?")) {
                this.currentSchedule.month = this.originalSchedule.month = this.currentScheduleKey
                const payload = JSON.parse(JSON.stringify(this.currentSchedule))
                payload.original = JSON.parse(JSON.stringify(this.originalSchedule))
                API.sendUpdatedSchedule(payload)
                this.cacheOriginalSchedule()
            }
        },
        async fetchMonthlySchedule() {
            const scheduleFor = `${this.currentScheduleKey}`
            const fridayDates = this.fridayDates
            const data = await API.fetchMonthlySchedules(scheduleFor, fridayDates)
            if (data === 'No locations or timings were found!') this.initalized = false
            else this.updateSchedule(data)
        },
        async fetchKhateebs() {
            const khateebs = await API.getKhateebs('no')
            if (khateebs === `you haven't created any khateebs!`) {
                this.initalized = false
            } else {
                this.khateebList = khateebs
                this.emptyKhateeb = this.toBeDecidedIndicator(khateebs)
            }
        },
        toBeDecidedIndicator(khateebArray) {
            const randomKhateeb = JSON.parse(JSON.stringify(khateebArray[0]))
            for (let field in randomKhateeb) {
                randomKhateeb[field] = null
            }
            return randomKhateeb
        }
    },
    computed: {
        fridays() {
            return datetime.allUpcomingFridays(this.month)
        },
        displayedMonthInfo() {
            const firstFridayOfMonth = this.fridays[0].split(' ')
            const returnValue = {
                month: firstFridayOfMonth[1],
                year: firstFridayOfMonth[2],
                abbreviatedMonthName: firstFridayOfMonth[1].slice(0,3)
            }
            return returnValue
        },
        currentScheduleKey() {
            return `${this.displayedMonthInfo.month}${this.displayedMonthInfo.year}`
        },
        fridayDates() {
            let splitDates = []
            let entry
            for (entry of this.fridays) {
                const x = entry.split(' ')
                splitDates.push(x[0])
            }
            return splitDates
        },
        shownLocations() {
            const location = this.displayData.location
            if (location !== 'All') {
                let returnLocation = {}
                returnLocation[location] = this.currentSchedule.data.rows[location] 
                return  returnLocation
            } else return this.currentSchedule.data.rows
        },
        isSame() {
            return equal(this.currentSchedule.data.rows, this.originalSchedule.data.rows)
        }
    },
    created() {
        this.fetchMonthlySchedule()
        this.fetchKhateebs()
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
<template>
    <div style="padding-top: 20px;">
        set schedule<br>
        {{ month }}
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
                v-for="(prayerLocationData, location_ID) in khateebInfo.locationInfo"
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
                    <th v-for="columnNames in khateebInfo.columnData" :key="columnNames">
                        {{columnNames}}
                    </th>
                </tr>
                <tr v-for="(khateeb, prayerTiming) in prayerLocation.monthlySchedule[displayData.weekOf]" :key="prayerTiming">
                    <th>
                        {{ `${prayerLocation.timing[prayerTiming].hour}:${prayerLocation.timing[prayerTiming].minutes}${prayerLocation.timing[prayerTiming].AMorPM}` }}
                    </th>
                    <th>
                        <input 
                        v-model="khateebInfo.locationInfo[locationID].monthlySchedule[displayData.weekOf][prayerTiming]" 
                        >
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
            khateebInfo : {
                columnData: null,
                locationInfo: null,
                originalSchedule: null,
                _id: null,
                __v: null
            },
            displayData: {
                location: 'All',
                weekOf: this.$store.state.date.upcomingFriday.date,
            },
            token: this.$store.state.JWT_TOKEN
        }
    },
    methods: {
        // need to add function that checks if timings have been changed
        // and if so fill in vacant new spot with TBD
        // without losing already given order
        incrementMonth(value) {
            const currentMonth = this.month.getMonth()
            const halfOfAMonth = 15
            while (this.month.getMonth() === currentMonth) {
                this.month = new Date(this.month.setDate(this.month.getDate() + (halfOfAMonth * value)))
            }
            this.$nextTick(async () => {
                const scheduleFor = `${this.displayedMonthInfo.month}${this.displayedMonthInfo.year}`
                const data = await API.fetchMonthlySchedules(this.token, scheduleFor)
                if (data.msg === 'No data recorded for given month') {
                    this.createNewEmptyTable()
                } else {
                    this.updateSchedule(data)
                }
                this.displayData.weekOf = this.fridayDates[0]
            })
        },
        revertToOriginal(location, index) {
            const originalData = JSON.parse(JSON.stringify(this.khateebInfo.originalSchedule[location].monthlySchedule[this.displayData.weekOf][index]))
            this.khateebInfo.locationInfo[location].monthlySchedule[this.displayData.weekOf].splice(index, 1, originalData)
        },
        createNewEmptyTable() {
            const toBeDecidedIndicator = 'TBD'
            for (let location in this.khateebInfo.locationInfo) {
                let numberOfRows = this.khateebInfo.locationInfo[location].timing.length
                let emptyArray = []
                for (let i = 0; i < numberOfRows; i++) {
                        emptyArray.push(toBeDecidedIndicator)
                }
                let newWeeks = {}
                for (let weeks in this.fridayDates) {
                    newWeeks[this.fridayDates[weeks]] = emptyArray
                }
                this.khateebInfo.locationInfo[location].monthlySchedule = newWeeks
                this.cacheOriginalSchedule()
            }
            delete this.khateebInfo._id
            delete this.khateebInfo.__v
        },
        updateSchedule(schedule) {
            this.khateebInfo.columnData = schedule.data.columnData
            this.khateebInfo.locationInfo = schedule.data.rows
            this.khateebInfo._id = schedule.data._id
            this.khateebInfo.__v = schedule.data.__v
            this.cacheOriginalSchedule()
        },
        cacheOriginalSchedule() {
            this.khateebInfo.originalSchedule = JSON.parse(JSON.stringify(this.khateebInfo.locationInfo))
        },
        saveData() {
            const toBeDecidedIndicator = 'TBD'
            if (window.confirm("Are you sure you want to save these changes?")) {
                for (let location in this.khateebInfo.locationInfo) {
                    for (let week in this.khateebInfo.locationInfo[location].monthlySchedule) {
                        for (let khateeb in this.khateebInfo.locationInfo[location].monthlySchedule[week]) {
                            if (this.khateebInfo.locationInfo[location].monthlySchedule[week][khateeb] === '') {
                                this.khateebInfo.locationInfo[location].monthlySchedule[week].splice(khateeb, 1, toBeDecidedIndicator)
                            } 
                        }
                    }
                }
                const payload = {
                    key: this.currentScheduleKey,
                    updatedSchedule: this.khateebInfo.locationInfo,
                    originalSchedule: this.khateebInfo.originalSchedule,
                    _id: this.khateebInfo._id,
                    __v: this.khateebInfo.__v
                }
                API.sendUpdatedSchedule(this.token, payload)
                this.cacheOriginalSchedule()
            }
        },
        async fetchInitialTable() {
            const payload = {
                month: this.currentScheduleKey,
                fridayDates: this.fridayDates
            }
            const data = await API.initialTable(this.token, payload)
            this.updateSchedule(data)
        },
        async makeInitialAPICalls() {
            const scheduleFor = `${this.$store.state.date.currentDate.month}${this.$store.state.date.currentDate.year}`
            const data = await API.fetchMonthlySchedules(this.token, scheduleFor)
            if (data.msg === 'No data recorded for given month') {
                this.fetchInitialTable()
            } else {
                this.updateSchedule(data)
            }
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
                returnLocation[location] = this.khateebInfo.locationInfo[location] 
                return  returnLocation
            } else return this.khateebInfo.locationInfo
        },
        isSame() {
            return equal(this.khateebInfo.locationInfo, this.khateebInfo.originalSchedule)
        }
    },
    async created() {
        this.makeInitialAPICalls()
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
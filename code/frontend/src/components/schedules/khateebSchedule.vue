<template>
    <div>
        <div v-if="struct">
            <div v-show="moreThanOneLocation()">
                <button @click="changeViewingLocation('all')">All</button>
                <button 
                    v-for="(location, locationHash) in locationsIndex" 
                    :key="locationHash"
                    @click="changeViewingLocation(locationHash)"
                >
                    {{ location.name }}
                </button>
            </div>
            <div>
                <button 
                    v-for="week of weeklyKeys" 
                    :key="week" 
                    class="red"
                    @click="changeViewingWeek(week)"
                >
                    {{ date.toLocaleString('en-US', { month: 'short' }) }} {{ week }}
                </button>
            </div>
            <slot
                :date="date"
                :originalDate="originalDate"
                :changeViewingMonth="changeViewingMonth"
            ></slot>
            <div>
                <p v-show="moreThanOneLocation()">
                    Displayed Location: {{ selected.location === 'all' ? 'All' : locationsIndex[locationID].name }}
                </p>
                <p>
                    Displayed week: {{ date.toLocaleString('en-US', { month: 'short' }) }} {{ selected.week }}
                </p>
            </div>
            <div v-for="(location, locationID) in shownLocations" :key="locationID">
                <p>
                    {{ locationsIndex[locationID].name }}
                </p>
                <div v-for="(timing, timingNo) in location[selected.week]" :key="timingNo">
                    <div class="jummahContainer">
                        <div class="timingLabel">
                            {{ timingDisplay(timing.timingID) }}
                        </div>
                        <div class="jummahPreferences">
                            <component
                                @changed="changePreference(timing, $event)" 
                                :is="'institutionAdmin'"
                                :timing="timing"
                                :khateebs="khateebs"
                                :weekOf="selected.week"
                                :viewingMonth="viewingMonth"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import datetime from '@/utils/dateTime/main.js'

export default {
    name: "khateebSchedule",
    components: {
        "institutionAdmin": () => import('@/components/schedules/adminCells.vue')
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        revertToPreviousMonth: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            struct: null,
            originalStruct: null,
            locationsIndex: null,
            timingsIndex: null,
            khateebs: null,
            cachedDate: null,
            date: new Date(),
            originalDate: new Date(),
            selected: {
                week: datetime.upcomingFriday(true).getDate().toString(),
                location: 'all'
            }
        }
    },
    methods: {
        async getSchedule(date) {
            try {
                const month = date.getMonth()
                const year = date.getFullYear()
                const schedule = await this.$API.institutionAdmin.getSchedule(month, year)
                return schedule
            } catch(err) {
                console.log(err)
            }
        },
        changeViewingLocation(val) {
            this.selected.location = val
        },
        moreThanOneLocation() {
            return Object.keys(this.locationsIndex).length > 1
        },
        changeViewingWeek(val) {
            this.selected.week = val
        },
        changeViewingMonth(val){
            this.cachedDate = new Date(this.date)
            this.date = val
            this.$emit('schedule-date', this.date)
        },
        changePreference(timing, $event) {
            const targetPreference = this._.deepCopy(timing.khateebPreference[$event.number])
            targetPreference.khateebID = $event.val
            this.$set(timing.khateebPreference, $event.number, targetPreference)
        },
        timingDisplay(timingID) {
            const time = this.timingsIndex[timingID]
            const hour = time.hour > 12 ? time.hour - 12 : time.hour
            const min = time.minute < 10 ? `0${time.minute}` : time.minute
            const amOrPm = time.hour > 11 ? 'PM' : 'AM'
            return `${hour}:${min}${amOrPm}`
        },
        ArrayToObject(keyAttribute, array) {
            const obj = {}
            array.forEach(elem => {
                obj[elem[keyAttribute]] = this._.deepCopy(elem)
            })
            return obj
        },
        buildStruct(jummahs) {
            const struct = {}
            const locations = Object.keys(this.locationsIndex)
            locations.forEach(location => { struct[location] = {} })
            jummahs.forEach(jummah => {
                if (!struct[jummah.locationID][jummah.weekOf])
                    struct[jummah.locationID][jummah.weekOf] = []
                struct[jummah.locationID][jummah.weekOf].push(jummah)
            })
            return struct
        },
        async init() {
            this.locationsIndex = this.ArrayToObject('_id', this.data.locations)
            this.timingsIndex = this.ArrayToObject('_id' ,this.data.timings)
            this.khateebs = this._.deepCopy(this.data.khateebs)
            this.struct = this.buildStruct(this.data.jummahs)
            this.originalStruct = this._.deepCopy(this.struct)
        }
    },
    computed: {
        viewingMonth() {
            const viewTime = this.date.getTime()
            const currentTime = this.originalDate.getTime()
            if (viewTime === currentTime)
                return 'current'
            else if (viewTime > currentTime)
                return 'future'
            else
                return 'past'    
        },
        weeklyKeys() {
            const locationKeys = Object.keys(this.struct)
            const firstLocation = this.struct[locationKeys[0]]
            return Object.keys(firstLocation)
        },
        shownLocations() {
            if (this.selected.location === 'all')
                return this.struct
            else {
                const location = {}
                location[this.selected.location] = this.struct[this.selected.location]
                return location
            }
        }
    },
    watch: {
        data(newVal) {
            this.init()
            this.selected.week = this.weeklyKeys[0]
        },
        revertToPreviousMonth(newVal) {
            console.log(newVal)
            if (newVal)
                this.date = new Date(this.cachedDate)
        }
    },
    created() {
        this.$emit('schedule-date', this.date)
    }
}
</script>

<style lang="scss" scoped>
.jummahContainer {
    display: flex;
    width: 70%;
    height: 10%;
    margin-left: auto;
    margin-right: auto;
    flex-direction: column;
}

.timingLabel {
    background: red;
}

.jummahPreferences {
    background: blue;
}

</style>
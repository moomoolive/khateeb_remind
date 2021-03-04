<template>
    <div>
        <div v-if="struct" class="schedule-container">
            
            <!-- schedule controls -->

            <!-- controls that are found in all versions of schedule -->
            <div class="std-controls-container">
                
                <!-- location viewing controls -->
                <div class="std-controls">
                    <div>
                        <button 
                            @click="changeViewingLocation('all')"
                            :class="`location-btns ${selected.location === 'all' ? 'active-controls' : ''}`"
                        >
                            {{  moreThanOneLocation ? 'All' : 'All Locations' }}
                        </button>
                    </div>
                    <div v-show="moreThanOneLocation">
                        <button
                            :class="`location-btns ${selected.location === locationHash ? 'active-controls' : ''}`"  
                            v-for="locationHash in locationKeys" 
                            :key="locationHash"
                            @click="changeViewingLocation(locationHash)"
                        >
                            {{ locationsIndex[locationHash].name }}
                        </button>
                    </div>
                </div>
                <!-- ENDS HERE -->

                <!-- weekly viewing controls -->
                <div class="std-controls">
                    <button
                        :class="selected.week === week ? 'active-controls' : ''" 
                        v-for="week of weeklyKeys" 
                        :key="week" 
                        class="red"
                        @click="changeViewingWeek(week)"
                    >
                        {{ date.toLocaleString('en-US', { month: 'short' }) }} {{ week }}
                    </button>
                </div>
                <!-- ENDS HERE -->

            </div>
            <!-- ENDS HERE -->

            <div v-if="!!$scopedSlots.default" class="external-controls">
                <slot
                    :date="date"
                    :originalDate="originalDate"
                    :changeViewingMonth="changeViewingMonth"
                ></slot>
            </div>
            <!-- ENDS HERE --> 

            <div class="locations-container">
                
                <!-- locations -->
                <div 
                    v-for="(location, locationID) in shownLocations" 
                    :key="locationID"
                >
                    <button 
                        v-if="testInstitution"
                        class="red"
                        @click="sendNotification()"
                    >
                        Send Notifications for Current Week
                    </button>
                    <div class="location-container">

                        <!-- location information -->
                        <p class="location-label">
                            {{ locationsIndex[locationID].name }}
                        </p>
                        <!-- LOCATION INFORMATION ENDS HERE -->

                        <div v-if="weekHasData(location[selected.week])">

                            <!-- jummahs for location -->
                            <div v-for="(timing, timingNo) in location[selected.week]" :key="timingNo">
                                <div class="jummahContainer">
                                    <button 
                                        v-if="testInstitution"
                                        @click="clearJummahStatus(timing)"
                                    >
                                        Clear Jummah Status
                                    </button>

                                    <!-- tags for jummah -->
                                    <div class="timing-container">
                                        <div 
                                            v-if="reciever === 'institutionAdmin'" 
                                            class="jummah-status-container"
                                        >
                                            <tag-circle 
                                                :info="adminTimingTag(timing)"
                                            />
                                        </div>
                                        <span class="timingLabel">
                                            {{ timingDisplay(timing.timingID) }}
                                        </span>
                                    </div>
                                    <!-- JUMMAH TAGS ENDS HERE -->

                                    <!-- jummah preferences -->
                                    <div class="jummahPreferences">
                                        <component
                                            v-if="showCell"
                                            @changed="changePreference(timing, $event)"
                                            @override="overrideJummah(timing)" 
                                            :is="reciever"
                                            :timing="timing"
                                            :khateebs="khateebs"
                                            :weekOf="selected.week"
                                            :viewingMonth="viewingMonth"
                                            :currentWeek="currentWeek"
                                        />

                                        <!-- jummah updated date -->
                                        <div class="last-updated">
                                            <span class="timing">Last Updated:</span><br>
                                            {{ _.dynamicDisplayDate(timing.updatedAt) }}
                                        </div>
                                        <!-- DATE DISPLAY 
                                        ENDS HERE -->

                                    </div>
                                    <!-- JUMMAH PREFERENCES ENDS HERE -->

                                </div>
                            </div>
                            <!-- JUMMAHS FOR LOCATIONS ENDS HERE --> 

                        </div>
                    </div>
                </div>
                <!-- LOCATIONS END HERE -->

                <div v-if="emitCopy">
                    <button 
                        class="submit-schedule silver"
                        :disabled="!readyToSubmit"
                        @click="emitSchedule()"
                    >
                        {{ buttonText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import datetime from '@/libraries/dateTime/main.js'

import tagCircle from '@/components/general/tagCircle.vue'

import equal from 'fast-deep-equal'

export default {
    name: "khateebSchedule",
    components: {
        "institutionAdmin": () => import('@/components/schedules/adminCells.vue'),
        "khateeb": () => import("./khateebCells.vue"),
        tagCircle
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        reciever: {
            type: String,
            required: true
        },
        revertToPreviousMonth: {
            type: Boolean,
            required: false
        },
        emitCopy: {
            type: Boolean,
            required: false
        },
        buttonText: {
            type: String,
            required: false,
            default: 'Submit Changes'
        }
    },
    data() {
        return {
            struct: null,
            originalStruct: null,
            locationsIndex: null,
            timingsIndex: null,
            khateebs: null,
            jummahs: null,
            originalJummahs: null,
            cachedDate: null,
            date: datetime.upcomingFriday(true),
            originalDate: null,
            showCell: true,
            selected: {
                week: null,
                location: 'all'
            },
            testInstitution: this.$store.getters['user/allInfo'].handle === "testMaster"
        }
    },
    methods: {
        adminTimingTag(timing) {
            switch(this.viewingMonth) {
                case 'past':
                    if (timing.confirmed)
                        return {
                            words: 'Complete',
                            color: 'green',
                            icon: '✔️'
                        }
                    else
                        return {
                            words: 'Missed',
                            color: 'red',
                            icon: '❌'
                        }
                case 'future':
                    return {
                        words: 'Future',
                        color: 'blue',
                        icon: '📅'
                    }
                case 'current':
                    if (this.currentWeek === 'current') {
                        if (timing.confirmed) {
                            return {
                                words: 'Confirmed',
                                color: 'green',
                                icon: '👍'
                            }
                        } else {
                            if (timing.khateebPreference[0].notified)
                                return {
                                    words: 'Notified',
                                    color: 'purple',
                                    icon: '📱'
                                }
                            else
                                return {
                                    words: 'Pending',
                                    color: 'purple',
                                    icon: '⏱️'
                                }
                        }
                    }
                    else if (this.currentWeek === 'future')
                        return {
                            words: 'Future',
                            color: 'blue',
                            icon: '📅'
                        }
                    else {
                        if (timing.confirmed)
                            return {
                                words: 'Complete',
                                color: 'green',
                                icon: '✔️'
                            }
                        else
                            return {
                                words: 'Missed',
                                color: 'red',
                                icon: '❌'
                            }
                    }
                default:
                    return {
                        words: 'Pending',
                        color: 'purple',
                        icon: '⏱️'
                    }
            }
        },
        overrideJummah(jummah) {
            jummah.khateebPreference[0].confirmed = true
            jummah.khateebPreference[0].notified = true
            jummah.khateebPreference[0].responded = true
            jummah.confirmed = true
            this.$emit('override', [jummah])
        },
        locationHasData(location) {
            const empty = Object.keys(location).length < 1
            return !empty
        },
        weekHasData(week) {
            const empty = week.length < 1
            return !empty
        },
        changeViewingLocation(val) {
            this.selected.location = val
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
            return `${hour}:${min} ${amOrPm}`
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
                const CompleteJummahDate = new Date(jummah.date)
                const jummahDate = CompleteJummahDate.getDate()
                if (!struct[jummah.locationID][jummahDate])
                    struct[jummah.locationID][jummahDate] = []
                struct[jummah.locationID][jummahDate].push(jummah)
            })
            return struct
        },
        async emitSchedule() {
            const confirm = await this._.confirm(`Are you sure you want make these changes?`)
            if (!confirm)
                return
            const diff = []
            for (let i = 0; i < this.jummahs.jummahs.length; i++) {
                if (!equal(this.jummahs.jummahs[i], this.originalJummahs.jummahs[i]))
                    diff.push(this.jummahs.jummahs[i])
            }
            this.$emit('copy', diff)
        },
        filterEmptyLocations(struct) {
            const copy = struct
            for (let [location, weeklyData] of Object.entries(copy)) {
                const empty = Object.keys(weeklyData) < 1
                if (empty)
                    delete copy[location]
            }
            return copy
        },
        init() {
            this.jummahs = this._.deepCopy(this.data)
            this.originalJummahs = this._.deepCopy(this.jummahs)
            this.locationsIndex = this.ArrayToObject('_id', this.jummahs.locations)
            this.timingsIndex = this.ArrayToObject('_id' ,this.jummahs.timings)
            this.khateebs = this._.deepCopy(this.jummahs.khateebs)
            this.struct = this.buildStruct(this.jummahs.jummahs)
            this.struct = this.filterEmptyLocations(this.struct)
            this.originalStruct = this._.deepCopy(this.struct)
        },
        rerenderJummahCell() {
            this.showCell = false
            this.$nextTick(() => { this.showCell = true })
        },
        /*
        TBD
        async sendNotification() {
            try {
                const res = await this.$API.institutionAdmin.sendNotifications()
                console.log(res)
            } catch(err) {
                console.log(err)
            }
        },
        async clearJummahStatus(timing) {
            try {
                timing.confirmed = false
                timing.khateebPreference.forEach(preference => {
                    preference.notified = false
                    preference.responded = false
                    preference.confirmed = false
                })
                console.log(timing)
                const res = await this.$API.institutionAdmin.clearJummah(timing)
                console.log(res)
            } catch(err) {
                console.log(err)
            }
        }
        */
    },
    computed: {
        viewingMonth() {
            let viewTime = new Date(this.date)
            viewTime.setDate(1)
            viewTime = viewTime.getTime()
            let currentTime = new Date(this.originalDate)
            currentTime.setDate(1)
            currentTime = currentTime.getTime()
            if (viewTime === currentTime)
                return 'current'
            else if (viewTime > currentTime)
                return 'future'
            else
                return 'past'    
        },
        currentWeek() {
            if (this.viewingMonth !== 'current')
                return 'null'
            const currentWeek = this.originalDate.getDate()
            const selected = parseInt(this.selected.week)
            if (currentWeek === selected)
                return 'current'
            else if (currentWeek > selected)
                return 'past'
            else
                return 'future'
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
        },
        readyToSubmit() {
            return !equal(this.struct, this.originalStruct)
        },
        slotPassed() {
            return this.$scopedSlots.default
        },
        locationKeys() {
            const keys = []
            for (let [location, weeklyData] of Object.entries(this.struct)) {
                const empty = weeklyData[this.selected.week].length < 1
                if (!empty)
                    keys.push(location)
            }
            return keys 
        },
        moreThanOneLocation() {
            return this.locationKeys.length > 1
        },
        selectedWeek() {
            return this.selected.week
        }
    },
    watch: {
        data(newVal) {
            this.init()
            if (!this.selected.week)
                this.selected.week = datetime.upcomingFriday(true).getDate().toString()
            else
                this.selected.week = this.weeklyKeys[0]
            this.rerenderJummahCell()
        },
        revertToPreviousMonth(newVal) {
            if (newVal)
                this.date = new Date(this.cachedDate)
        },
        selectedWeek() {
            this.rerenderJummahCell()
        }
    },
    created() {
        this.originalDate = new Date(this.date)
        this.$emit('schedule-date', this.date)
    }
}
</script>

<style lang="scss" scoped>
.schedule-container {
    padding-top: 30px;
    padding-bottom: 30px;
    background: themeRGBA("darkBlue", 0.5);
    width: 70%;
    max-width: 850px;
    min-width: 200px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.locations-container {
    margin-top: 60px;
}

.location-container {
    background: themeRGBA("green", 0.7);
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom: 60px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.jummahContainer {
    display: flex;
    width: 70%;
    height: 20%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    flex-direction: row;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    border-radius: 7px;
}

.location-label {
    font-size: 35px;
    font-weight: bold;
    text-decoration: underline dotted;
}

.timing-container {
    background: getColor("offWhite");
    height: auto !important;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.timingLabel {
    font-size: 19px;
}

.jummah-status-container {
    height: 40%;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.jummahPreferences {
    background: getColor("silver");
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.std-controls {
    width: 98%;
    background: themeRGBA("grey", 0.8);
    margin-left: auto;
    margin-right: auto;
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    margin-top: 10px;
}

.location-btns {
    width: 30%;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
}

.external-controls {
    width: 80%;
    background: themeRGBA("grey", 0.8);
    margin-left: auto;
    margin-right: auto;
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    margin-top: 10px;
}

.std-controls-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
}

.active-controls {
    @include blinkingAnimation()
}

.submit-schedule {
    width: 80%;
    height: 6vh;
    max-height: 50px;
    font-size: 18px;
    color: black;
}

.last-updated {
    font-size: 16px;
    margin-top: 10px;
    font-weight: bold;
    background: themeRGBA("red", 0.9);
    margin-left: auto;
    margin-right: auto;
    width: 87%;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

span {
    &.timing {
        font-size: 14px;
        text-decoration: underline;
        color: getColor("offWhite");
    }
}

@media screen and (max-width: $phoneWidth) {
    .last-updated {
        font-size: 2.2vh;
    }
    .schedule-container {
            background: themeRGBA("darkBlue", 0.5);
            width: 90%;
    }
    .locations-container {
        margin-top: 8vh;
    }
    .jummahContainer {
        display: flex;
        flex-direction: column;
    }
    .location-container {
        margin-bottom: 20%;
    }
    .location-label {
        font-size: 3.6vh;
    }
    .timingLabel {
        font-size: 3vh;
    }
    .timing-container {
        padding-top: 2vh;
        padding-bottom: 2vh;
        background: getColor("offWhite");
        height: auto !important;
        border-radius: 0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }
    .jummah-status-container {
        margin-bottom: 2vh;
        height: 5vh;
    }
    .jummahPreferences {
        border-radius: 0;
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        padding-top: 2vh;
        padding-bottom: 2vh;
        padding-top: 0;
    }
    .std-controls {
        display: flex;
        flex-direction: column;
        width: 40%;
        height: auto !important;
    }
    .std-controls-container {
        display: flex;
        flex-direction: row;
    }
    .external-controls {
        width: 73%;
    }
    .submit-schedule {
        font-size: 2vh;
    }
    .location-btns {
        width: 85%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1vh;
    }
}

</style>
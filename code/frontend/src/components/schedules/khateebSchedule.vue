<template>
    <div>
        <div v-if="struct" class="schedule-container">
            <div class="std-controls-container">
                <div v-show="moreThanOneLocation()" class="std-controls">
                    <button 
                        @click="changeViewingLocation('all')"
                         :class="selected.location === 'all' ? 'active-controls' : ''"
                    >
                        All
                    </button>
                    <button
                        :class="selected.location === locationHash ? 'active-controls' : ''"  
                        v-for="(location, locationHash) in locationsIndex" 
                        :key="locationHash"
                        @click="changeViewingLocation(locationHash)"
                    >
                        {{ location.name }}
                    </button>
                </div>
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
            </div>
            <div v-if="!!$scopedSlots.default" class="external-controls">
                <slot
                    :date="date"
                    :originalDate="originalDate"
                    :changeViewingMonth="changeViewingMonth"
                ></slot>
            </div>
            <div class="locations-container">
                <div 
                    v-for="(location, locationID) in shownLocations" 
                    :key="locationID"
                    class="location-container"
                >
                    <p class="location-label">
                        {{ locationsIndex[locationID].name }}
                    </p>
                    <div v-for="(timing, timingNo) in location[selected.week]" :key="timingNo">
                        <div class="jummahContainer">
                            <div class="timingLabel">
                            <span>{{ timingDisplay(timing.timingID) }}</span>
                            </div>
                            <div class="jummahPreferences">
                                <component
                                    @changed="changePreference(timing, $event)" 
                                    :is="reciever"
                                    :timing="timing"
                                    :khateebs="khateebs"
                                    :weekOf="selected.week"
                                    :viewingMonth="viewingMonth"
                                />
                            </div>
                        </div>
                    </div>
                </div>
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
import datetime from '@/utils/dateTime/main.js'

import equal from 'fast-deep-equal'

export default {
    name: "khateebSchedule",
    components: {
        "institutionAdmin": () => import('@/components/schedules/adminCells.vue'),
        "khateeb": () => import("./khateebCells.vue")
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
            date: new Date(),
            originalDate: new Date(),
            selected: {
                week: null,
                location: 'all'
            }
        }
    },
    methods: {
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
                if (!struct[jummah.locationID][jummah.weekOf])
                    struct[jummah.locationID][jummah.weekOf] = []
                struct[jummah.locationID][jummah.weekOf].push(jummah)
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
        init() {
            this.jummahs = this._.deepCopy(this.data)
            this.originalJummahs = this._.deepCopy(this.jummahs)
            this.locationsIndex = this.ArrayToObject('_id', this.jummahs.locations)
            this.timingsIndex = this.ArrayToObject('_id' ,this.jummahs.timings)
            this.khateebs = this._.deepCopy(this.jummahs.khateebs)
            this.struct = this.buildStruct(this.jummahs.jummahs)
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
        },
        readyToSubmit() {
            return !equal(this.struct, this.originalStruct)
        },
        slotPassed() {
            return this.$scopedSlots.default
        }
    },
    watch: {
        data(newVal) {
            this.init()
            if (!this.selected.week)
                this.selected.week = datetime.upcomingFriday(true).getDate().toString()
            else
                this.selected.week = this.weeklyKeys[0]
        },
        revertToPreviousMonth(newVal) {
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
    flex-direction: row;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    border-radius: 7px;
}

.location-label {
    font-size: 35px;
    font-weight: bold;
    text-decoration: underline dotted;
}

.timingLabel {
    background: getColor("offWhite");
    height: auto !important;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
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

@media screen and (max-width: $phoneWidth) {
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
        padding-top: 2vh;
        padding-bottom: 2vh;
        background: getColor("offWhite");
        height: auto !important;
        border-radius: 0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        font-size: 3vh;
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
}

</style>
<template>
    <div class="schedule-container">
        <loading :loadingTime="800">   
            <div v-if="locations.length > 0">
                <!-- control buttons -->
                <div class="std-controls-container">

                    <!-- location buttons -->
                    <locations-button-group 
                        class="std-controls"
                        :locations="filteredLocations"
                        :selectedLocation="selectedLocation"
                        @change-location="changeViewingLocation($event)"
                    />
                    <!-- LOCATION BUTTONS END HERE -->

                    <!-- date buttons -->
                    <switch-weeks-button-group 
                        class="std-controls"
                        :selectedDate="selectedDate"
                        @change-week="changeViewingWeek($event)"
                    />
                    <!-- DATE BUTTONS END HERE -->

                </div>

                <!-- switch month buttons -->
                <switch-months-button-group 
                    class="external-controls"
                    :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                    @change-month="changeViewingMonth($event)"
                    @back-to-current="backToCurrentMonth()"
                />
                <!-- SWITCH MONTH BUTTONS HERE -->

                <div class="locations-container" v-if="locations.length > 0">

                    <div v-if="jummahs.length > 0">

                        <!-- locations -->
                        <div
                            v-for="(location, locationIndex) in filteredLocations"
                            :key="locationIndex"
                            class="location-container"
                        >
                            <!-- location info -->
                            <div>
                                <p class="location-label">{{ location.name }}</p>
                                <p class="location-label">{{ location.address }}</p>
                            </div>
                            <!-- LOCATION INFO ENDS HERE -->

                            <!-- jummah -->
                            <jummah-displayer
                                v-for="(jummah, jummahIndex) in filteredJummahs.filter(jummah => jummah.locationID === location._id)"
                                :key="jummahIndex"
                                class="jummahContainer"
                                :jummah="jummah"
                                :filteredTimings="filteredTimings"
                                :reciever="reciever"
                                :khateebs="khateebs"
                                :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                                :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                                :selectedDate="selectedDate"
                            />
                            <!-- JUMMAH ENDS HERE -->
                        
                        </div>
                        <!-- LOCATIONS END HERE -->
                    </div>

                    <!-- if there aren't any jummahs for requested month -->
                    <div v-else>
                        <component :is="`${reciever}NoJummahs`"/>
                    </div>
                    <!-- NO JUMMAHS REQUESTED MONTH ENDS HERE -->
                </div>
            </div>

            <!-- Error display -->
            <div v-else>
                <msg-with-pic
                    class="empty-notifications-msg" 
                    :gif="`sadCat`"
                    :msg="`There was a problem retrieving the schedule`"
                    :textColor="`white`"
                />
            </div>
            <!-- ERROR DISPLAY ENDS HERE -->
        </loading>

        <router-query-manager
            v-if="locations.length > 0"
            :locations="locations"
            :selectedLocationQueryKey="selectedLocationQueryKey"
            :selectedDateQueryKey="selectedDateQueryKey"
            @changed="updateViewBasedOnQuery($event)"
        />

    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'
import loading from '@/components/general/loadingScreen.vue'
import routerQueryManager from './routerQueryManager.vue'
import locationsButtonGroup from './buttonGroups/locations.vue'
import switchWeeksButtonGroup from './buttonGroups/weeks.vue'
import switchMonthsButtonGroup from './buttonGroups/months.vue'
import jummahDisplayer from './locationComponents/jummahDisplayer.vue'

import datetime from '@/libraries/dateTime/main.js'

export default {
    name: "jummahScheduleDisplay",
    components: {
        loading,
        msgWithPic,
        routerQueryManager,
        locationsButtonGroup,
        switchWeeksButtonGroup,
        switchMonthsButtonGroup,
        jummahDisplayer,
        "institutionAdmin": () => import('@/components/schedules/adminCells.vue'),
        "khateeb": () => import("./khateebCells.vue"),
        "khateebNoJummahs": () => import('./noJummahsKhateeb.vue'),
        "institutionAdminNoJummahs": () => import('./noJummahsInstitutionAdmin.vue')
    },
    props:{
        jummahs: {
            type: Array,
            required: true
        },
        locations: {
            type: Array,
            required: true
        },
        timings: {
            type: Array,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        },
        reciever: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            selectedDate: datetime.upcomingFriday(true),
            selectedLocation: 'all',
            upcomingFriday: datetime.findUpcomingFriday(),
            selectedDateQueryKey: 'date',
            selectedLocationQueryKey: 'location'
        }
    },
    methods: {
        sortJummahByTime(jummahA, jummahB) {
            let jummahATiming = this.jummahTimingDateObject(jummahA).getTime()
            let jummahBTiming = this.jummahTimingDateObject(jummahB).getTime()
            if (jummahATiming > jummahBTiming)
                return -1
            else if (jummahATiming < jummahBTiming)
                return 1
            return 0
        },
        findJummahTiming(jummah) {
            return this.filteredTimings.find(timing => jummah.timingID === timing._id)
        },
        jummahTimingDateObject(jummah) {
            const timing = this.findJummahTiming(jummah)
            const dateObject = new Date()
            dateObject.setHours(timing.hour)
            dateObject.setMinutes(timing.minute)
            return dateObject
        },
        jummahTiming(jummah) {
            const timing = this.jummahTimingDateObject(jummah)
            return timing.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
        },
        updateViewBasedOnQuery(info) {
            console.log(info)
            this.selectedLocation = info.location
            if (info.monthChanged)
                this.requestJummahs(info.date)
            this.selectedDate = new Date(info.date)
        },
        changeViewingLocation(value) {
            this.changeRouterQuery(this.selectedLocationQueryKey, value)
        },
        changeViewingWeek(date) {
            this.changeRouterQuery(
                this.selectedDateQueryKey, 
                datetime.dateFormatYM(new Date(date), true)
            )
        },
        changeViewingMonth(increment) {
            const date = new Date(this.selectedDate)
            date.setMonth(date.getMonth() + increment)
            date.setDate(1)
            const target = datetime.findUpcomingFriday(date)
            console.log(target)
            this.changeViewingWeek(target)
        },
        backToCurrentMonth() {
            this.changeViewingWeek(new Date(this.upcomingFriday))
        },
        changeRouterQuery(key, value) {
            if (this.$route.query[key] === value)
                return
            const query = { ...this.$route.query }
            query[key] = value
            this.$router.replace({ query })
        },
        createJummahRequestRange(date) {
            const greaterThanEqual = new Date(date)
            greaterThanEqual.setDate(1)
            greaterThanEqual.setUTCHours(12, 0, 0, 0)
            const lesserThan = new Date(greaterThanEqual)
            lesserThan.setMonth(lesserThan.getMonth() + 1)
            return {
                $gte: greaterThanEqual.toISOString(),
                $lt: lesserThan.toISOString()
            }
        },
        requestJummahs(date) {
            const query = this.createJummahRequestRange(date)
            this.$emit('request-jummahs', query)
        },
    },
    computed: {
        viewingMonthIsCurrentPastOrFuture() {
            if (datetime.sameMonthSameYear(this.upcomingFriday, this.selectedDate))
                return 'current'
            else if (this.upcomingFriday.getTime() < this.selectedDate.getTime())
                return 'future'
            else
                return 'past'
        },
        viewingWeekIsCurrentPastOrFuture() {
            if (this.viewingMonthIsCurrentPastOrFuture !== 'current')
                return this.viewingMonthIsCurrentPastOrFuture
            if (this.selectedDate.getTime() > this.upcomingFriday.getTime())
                return 'future'
            else if (this.selectedDate.getTime() < this.upcomingFriday.getTime())
                return 'past'
            else
                return 'current'
        },
        filteredJummahs() {
            return this.jummahs
                .filter(jummah => new Date(jummah.date).getDate() === this.selectedDate.getDate())
                .sort(this.sortJummahByTime)
        },
        filteredTimings() {
            return this.timings
                .filter(timing => this.jummahs
                    .filter(jummah => jummah.timingID === timing._id).length > 0
                )
        },
        locationsWithDataThisMonth() {
            return this.locations.filter(location => 
                this.jummahs.filter(jummah => jummah.locationID === location._id).length > 0
            )
        },
        filteredLocations() {
            let filterFunc = (location) => location
            if (this.selectedLocation !== 'all')
                filterFunc = (location) => location._id === this.selectedLocation
            return this.locationsWithDataThisMonth.filter(filterFunc)
        },
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
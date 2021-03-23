<template>
    <div>
        <general-popup-container
            v-if="showJummahSettings"
            @close="closeSettings()"
        >
            <jummah-settings-popup
                :reciever="reciever"
                :info="settingsInfo"
                :selectedDate="selectedDate"
                :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                @run-notification-loop="$emit('run-notification-loop', $event)"
                @clear-notifications="$emit('update-preference-fast', $event)"
                @close="closeSettings()"
            />
        </general-popup-container>
        <div class="schedule-container">
            <loading :loadingTime="800">

                <div class="above-controls-container">
                    <slot name="above-controls"></slot>
                </div>
                   
                <div v-if="locations.length > 0">
                    
                    <schedule-standard-controls 
                        :locations="locationsWithDataThisMonth"
                        :selectedLocation="selectedLocation"
                        :selectedDate="selectedDate"
                        :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                        @change-location="changeViewingLocation($event)"
                        @change-week="changeViewingWeek($event)"
                        @change-month="changeViewingMonth($event)"
                        @back-to-current-month="backToCurrentMonth()"
                    />

                    <locations-display
                        v-if="showLocations"
                        :locations="filteredLocations"
                        :jummahs="jummahs"
                        :selectedLocation="selectedLocation"
                        :timings="timings"
                        :reciever="reciever"
                        :khateebs="khateebs"
                        :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                        :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                        :selectedDate="selectedDate"
                        :monthsFromCurrent="monthsFromCurrent"
                        @new-preference="$emit('new-preference', $event)"
                        @update-preference="$emit('update-preference', $event)"
                        @open-settings="openJummahSettings($event)"
                    />

                    </div>

                    <div v-else>
                        <msg-with-pic
                            class="empty-notifications-msg" 
                            :gif="`flyingPlanesAllOver`"
                            :msg=" reciever === 'institutionAdmin' ?
                                `Please create you first location to get started` :
                                `Schedule hasn't been created yet`
                            "
                            :textColor="`white`"
                        />
                    </div>
            </loading>

            <router-query-manager
                v-if="locations.length > 0"
                :locations="locations"
                :selectedLocationQueryKey="selectedLocationQueryKey"
                :selectedDateQueryKey="selectedDateQueryKey"
                @changed="updateViewBasedOnQuery($event)"
            />

        </div>
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'
import loading from '@/components/general/loadingScreen.vue'
import routerQueryManager from './misc/routerQueryManager.vue'
import scheduleStandardControls from './controls/main.vue'
import locationsDisplay from './locationDisplay/locations-display.vue'
import generalPopupContainer from '@/components/notifications/generalPopup.vue'
import jummahSettingsPopup from './jummahSettingsPopup/main.vue'

import datetime from '@/libraries/dateTime/main.js'
import jummahHelpers from '@/libraries/jummahs/main.js'

export default {
    name: "jummahScheduleDisplay",
    components: {
        loading,
        msgWithPic,
        routerQueryManager,
        scheduleStandardControls,
        locationsDisplay,
        generalPopupContainer,
        jummahSettingsPopup
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
            selectedDate: datetime.findUpcomingFriday(),
            selectedLocation: 'all',
            upcomingFriday: datetime.findUpcomingFriday(),
            selectedDateQueryKey: 'date',
            selectedLocationQueryKey: 'location',
            showJummahSettings: false,
            showLocations: true,
            settingsInfo: {}
        }
    },
    methods: {
        openJummahSettings(jummahAndAssoicatedInfo) {
            this.settingsInfo = jummahAndAssoicatedInfo
            this.showJummahSettings = true
        },
        closeSettings() {
            this.showJummahSettings = false
        },
        updateViewBasedOnQuery(info) {
            //console.log(info)
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
        requestJummahs(date) {
            const query = jummahHelpers.createMonthlyRequestRange(date)
            this.$emit('request-jummahs', query)
        },
        initializeSettingsInfo() {
            this.settingsInfo.jummah = this.jummahs[0],
            this.settingsInfo.location = this.locations[0],
            this.settingsInfo.timing = this.timings[0]
        },
        rerenderLocations() {
            this.showLocations = false
            this.$nextTick(() => this.showLocations = true)
        }
    },
    computed: {
        monthsFromCurrent() {
            return datetime.monthsFromDate(new Date(this.upcomingFriday), new Date(this.selectedDate))
        },
        viewingMonthIsCurrentPastOrFuture() {
            if (this.monthsFromCurrent > 0)
                return 'future'
            else if (this.monthsFromCurrent < 0)
                return 'past'
            else
                return 'current'
        },
        viewingWeekIsCurrentPastOrFuture() {
            if (this.viewingMonthIsCurrentPastOrFuture !== 'current')
                return this.viewingMonthIsCurrentPastOrFuture
            else if (this.selectedDate.getDate() === this.upcomingFriday.getDate())
                return 'current'
            else if (this.selectedDate.getTime() > this.upcomingFriday.getTime())
                return 'future'
            else if (this.selectedDate.getTime() < this.upcomingFriday.getTime())
                return 'past'
            else
                return 'current'
            
        },
        locationsWithDataThisMonth() {
            return this.locations.filter(location =>
                location.active || 
                this.jummahs.filter(jummah => jummah.locationID === location._id).length > 0
            )
        },
        filteredLocations() {
            let filterFunc = (location) => location
            if (this.selectedLocation !== 'all')
                filterFunc = (location) => location._id === this.selectedLocation
            return this.locationsWithDataThisMonth.filter(filterFunc)
        },
    },
    watch: {
        jummahs() {
            this.rerenderLocations()
        },
        selectedDate() {
            this.rerenderLocations()
        }
    },
    created() {
        this.initializeSettingsInfo()
    }
}
</script>

<style lang="scss" scoped>
.schedule-container {
    padding-top: 15px;
    padding-bottom: 15px;
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

.above-controls-container {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
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
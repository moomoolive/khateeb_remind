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
                @clear-notifications="$emit('update-preference', $event)"
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
                    />

                    <div class="change-month-buttons-container">
                        <div>
                            <button class="yellow change-month-buttons" @click="changeViewingMonth(-1)">
                                <
                            </button>
                        </div>
                        <div class="month-indicator-text">
                            {{ this.selectedDate.toLocaleString('en-US', { month: "long", year: "2-digit" }) + "'" }}
                        </div>
                        <div>
                            <button class="yellow change-month-buttons" @click="changeViewingMonth(1)">
                                >
                            </button>
                        </div>
                    </div>

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
                        :fridayNumberOfSelectedMonth="fridayNumberOfSelectedMonth"
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
        fridayNumberOfSelectedMonth() {
            const firstFriday = datetime.findFirstFridayOfMonth(new Date(this.selectedDate))
            let count = 1
            const oneWeek = 7
            while (!datetime.sameDateMonthAndYear(firstFriday, this.selectedDate)) {
                firstFriday.setDate(firstFriday.getDate() + oneWeek)
                count++
            }
            return count
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
    created() {
        this.initializeSettingsInfo()
    }
}
</script>

<style lang="scss" scoped>
.change-month-buttons-container {
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.month-indicator-text {
    color: getColor("offWhite");
    font-size: 16px;
}

.change-month-buttons {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    font-size: 14px;
    font-weight: bold;
    max-height: 30px;
    max-width: 40px;
    color: black;
}

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

.above-controls-container {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
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

@media screen and (max-width: $phoneWidth) {
    .schedule-container {
            background: themeRGBA("darkBlue", 0.5);
            width: 90%;
    }
    .std-controls {
        display: flex;
        flex-direction: column;
        width: 40%;
        height: auto !important;
    }
}

</style>
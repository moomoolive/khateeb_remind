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
                :maxNotificationLoopRunCount="maxNotificationLoopRunCount"
                @run-notification-loop="$emit('run-notification-loop', $event)"
                @clear-notifications="$emit('update-preference', $event)"
                @khateeb-signup="$emit('khateeb-signup', $event)"
                @close="closeSettings()"
            />
        </general-popup-container>

        <div class="schedule-container">
            <loading>

                <div class="controls-position">

                    <div class="above-controls-container">
                        <slot name="above-controls"></slot>
                    </div>

                    <div class="buttons-container">
                        <schedule-standard-controls
                            v-if="locations.length > 0" 
                            :locations="locationsWithDataThisMonth"
                            :selectedLocation="selectedLocation"
                            :selectedDate="selectedDate"
                            :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                            @change-location="changeViewingLocation($event)"
                            @change-week="changeViewingWeek($event)"
                        />
                    </div>

                </div>
                   
                <div v-if="locations.length > 0">

                    <div class="change-month-buttons-container">
                        <div>
                            <button class="yellow change-month-buttons" @click="changeViewingMonth(-1)">
                                <!-- eslint-disable-next-line -->
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
                    
                    <div v-if="reciever === 'institutionAdmin'" class="unavailable-khateebs-position">
                        <collapse-transition :dimension="`width`" :duration="450">
                            <div
                                v-show="
                                    viewingWeekIsCurrentPastOrFuture !== 'past' &&
                                    khateebsUnavailableForSelectedWeek.length > 0
                                "
                                class="unavailable-khateebs-this-week-container silver"
                            >
                                
                                <div class="unavailable-khateebs-this-week-header-container" @click="toggleUnavailableKhateebs()">
                                    <div>
                                        <dropdown-arrow 
                                            :faceDown="showingUnavailable"
                                            class="dropdown-arrow"
                                        />
                                    </div>

                                    <div class="unavailable-khateebs-this-week-header">
                                        Khateebs Unavailable for this Date
                                    </div>

                                    <div class="unavailable-khateebs-this-week-header count">
                                         <span :class="`red ${ showingUnavailable ? 'unavailable-khateeb-count-invisible' : ''}`">
                                            ({{ khateebsUnavailableForSelectedWeek.length }})
                                        </span>
                                    </div>

                                </div>
                                
                                <collapse-transition :duration="450">
                                    <div v-show="showingUnavailable" class="unavailable-khateebs-this-week-tag-container">
                                        <tag-circle
                                            v-for="(khateeb, khateebIndex) in khateebsUnavailableForSelectedWeek"
                                            class="unavailable-khateeb-tag"
                                            :key="khateebIndex"
                                            :info="{
                                                words: khateebName(khateeb),
                                                color: 'grey',
                                                icon: '👳'
                                            }"
                                        />
                                    </div>
                                </collapse-transition>

                            </div>
                        </collapse-transition>
                    </div>

                    <locations-display
                        v-if="showLocations"
                        :locations="filteredLocations"
                        :jummahs="jummahs"
                        :selectedLocation="selectedLocation"
                        :timings="timings"
                        :reciever="reciever"
                        :completeKhateebsList="khateebs"
                        :khateebs="khateebsavailableForSelectedWeek"
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

                    <general-message
                        v-else
                        :message=" reciever === 'institutionAdmin' ?
                            `Please create you first location to get started` :
                            `Schedule hasn't been created yet`
                        "
                        :fontAwesomeIcon="['far', 'paper-plane']"
                        textColor="offWhite"
                        iconColor="green"
                    />

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
import loading from '@/components/general/loadingScreen.vue'
import routerQueryManager from './misc/routerQueryManager.vue'
import scheduleStandardControls from './controls/main.vue'
import locationsDisplay from './locationDisplay/locations-display.vue'
import generalPopupContainer from '@/components/notifications/generalPopup.vue'
import jummahSettingsPopup from './jummahSettingsPopup/main.vue'
import tagCircle from '@/components/general/tagCircle.vue'
import generalMessage from '@/components/misc/generalMessage.vue'
import dropdownArrow from '@/components/misc/dropdownArrow.vue'

import datetime from '@/libraries/dateTime/main.js'
import jummahHelpers from '@/libraries/jummahs/main.js'
import khateebHelpers from '@/libraries/khateebs/main.js'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import Config from '$config'

export default {
    name: "jummahScheduleDisplay",
    components: {
        loading,
        routerQueryManager,
        scheduleStandardControls,
        locationsDisplay,
        generalPopupContainer,
        jummahSettingsPopup,
        CollapseTransition,
        tagCircle,
        generalMessage,
        dropdownArrow
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
            settingsInfo: {},
            showingUnavailable: false,
            maxRunCount: Config.userRestrictionsConfig.notificationLoopMaxRunCountPerWeek
        }
    },
    methods: {
        toggleUnavailableKhateebs() {
            this.showingUnavailable = !this.showingUnavailable
        },
        khateebName(khateeb) {
            return khateebHelpers.khateebName(khateeb)
        },
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
        khateebsUnavailableForSelectedWeek() {
            return this.khateebs
                .filter(k => {
                    return k.unavailableDates.find(({ date }) => datetime.sameDateMonthAndYear(date, this.selectedDate))
                })
        },
        khateebsavailableForSelectedWeek() {
            return this.khateebs
                .filter(k => {
                    return !k.unavailableDates.find(({ date }) => datetime.sameDateMonthAndYear(date, this.selectedDate))
                })
        },
        totalNotificationLoopRunCount() {
            return this.jummahs
                .map(j => j.loopRunCount)
                .reduce((total, x) => total + x, 0)
        },
        maxNotificationLoopRunCount() {
            // divide by two because backups and main carry the same count (duplicates)
            return (this.totalNotificationLoopRunCount / 2) > this.maxRunCount
        }
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
    margin-bottom: 20px;
}

.month-indicator-text {
    color: getColor("offWhite");
    font-size: 18px;
    width: 150px;
}

.change-month-buttons {
    @include floatingBoxShadow();
    font-size: 14px;
    font-weight: bold;
    max-height: 30px;
    max-width: 40px;
    color: black;
    margin-left: 30px;
    margin-right: 30px;
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



.unavailable-khateebs-position {
    width: 80%;
    @include centerMargin();
    margin-top: 40px;
}

.unavailable-khateebs-this-week-container {
    width: 75%;
    max-width: 425px;
    padding-bottom: 20px;
    padding-top: 20px;
    margin-bottom: 30px;
    padding-left: 10px;
    padding-right: 10px;
    @include normalBorderRounding();
    @include floatingBoxShadow();
}

.unavailable-khateebs-this-week-header {
    font-size: 19px;
    font-weight: bold;
    
    &.count {
        margin-left: 5px;
    }
}

.unavailable-khateebs-this-week-header-container {
    @include flexboxDefault();
    width: 95%;
}

.unavailable-khateebs-this-week-tag-container {
    @include flexboxDefault(row, True);
    margin-top: 20px;
}

.unavailable-khateeb-tag {
    margin-bottom: 10px;
    margin-top: 10px;
    max-width: 150px;
    margin-left: 10px;
    margin-right: 10px;
}

.unavailable-khateeb-count-invisible {
    visibility: hidden;
}

.dropdown-arrow {
    margin-right: 10px;
}

.controls-position {
    @include flexboxDefault(row-reverse);
}

.buttons-container {
    margin-top: 30px;
}


@media screen and (max-width: $phoneWidth) {

    .buttons-container {
        margin-top: 0px;
    }

    .controls-position {
        flex-direction: column;
    }
    
    .schedule-container {
            background: themeRGBA("darkBlue", 0.5);
            width: 90%;
    }

    .unavailable-khateebs-this-week-header-container {
        width: 100%;
    }

    .month-indicator-text {
        font-size: 16px;
        font-size: 16px;
        width: 120px;
    }

    .unavailable-khateebs-this-week-header {
        font-size: 14px;
    }

    .dropdown-arrow {
        height: 12px;
        margin-right: 7px;
    }
}

</style>
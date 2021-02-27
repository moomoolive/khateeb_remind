<template>
    <div>
        <loading :externalFinishSignal="readyToShow">
            <div 
                v-if="jummahs" 
                class="locations-container"
            >
                
                <!-- locations -->
                <div
                    v-for="(location, locationIndex) in locations"
                    :key="locationIndex"
                    class="locations-container"
                >

                    <!-- location rendering layer -->
                    <div 
                        v-if="jummahs.filter(jummah => jummahsForLocation(location, jummah)).length > 0"
                        class="location-container"
                    >

                        <!-- location info -->
                        <div>
                            <p class="location-label">
                                {{ location.name }}
                            </p>
                            <p class="location-label">
                                {{ location.address }}
                            </p>
                        </div>
                        <!-- LOCATION INFO ENDS HERE -->

                        <!-- jummah -->
                        <div 
                            v-for="(jummah, jummahIndex) in jummahs.sort(sortJummahByTime)"
                            :key="jummahIndex"
                        >
                            <!-- jummah rendering layer -->
                            <div 
                                v-if="jummahsForLocation(location, jummah)"
                                class="jummahContainer"
                            >
                                <!-- timing display -->
                                <div class="timing-container">
                                    <div class="jummah-status-container" >
                                        <jummah-tag
                                            :jummah="jummah"
                                            :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                                            :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                                        />
                                    </div>
                                    <span class="timing-label">
                                        {{ jummahTiming(jummah) }}
                                    </span>
                                </div>
                                <!-- TIMING DISPLAY ENDS HERE -->
                                
                                <!-- schedule cell -->
                                <div class="jummahPreferences">
                                    <component
                                        v-if="showCell" 
                                        :is="reciever"
                                        :timing="jummah"
                                        :weekOf="selectedWeek"
                                        :viewingMonth="viewingMonthIsCurrentPastOrFuture"
                                        :currentWeek="viewingWeekIsCurrentPastOrFuture"
                                        :khateebs="khateebs"
                                    />
                                    
                                    <!-- updated date -->
                                    <div class="last-updated">
                                        <span class="timing">Last Updated:</span><br>
                                        {{ _.dynamicDisplayDate(jummah.updatedAt) }}
                                    </div>
                                    <!-- ENDS HERE -->
                                
                                </div>
                                <!-- SCHEDULE CELL END HERE -->

                            </div>
                            <!-- ENDS HERE -->

                        </div>
                        <!-- JUMMAH ENDS HERE -->

                    </div>
                    <!-- LOCATION RENDERING LAYER ENDS HERE -->
                
                </div>
                <!-- LOCATIONS END HERE -->
            </div>
        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import jummahTag from './jummahTimingTag.vue'

import datetime from '@/libraries/dateTime/main.js'

export default {
    name: "monthlyJummahSchedule",
    components: {
        loading,
        jummahTag,
        "institutionAdmin": () => import('@/components/schedules/adminCells.vue'),
        "khateeb": () => import("./khateebCells.vue")
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
        selectedWeek: {
            type: Date,
            required: true
        },
        reciever: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            selectedLocation: 'all',
            currentWeek: new Date(),
            showCell: true
        }
    },
    methods: {
        jummahsForLocation(location, jummah) {
            const selectedWeek = new Date(jummah.date).getDate() === this.selectedWeek.getDate()
            const forThisLocation = jummah.locationID === location._id
            return forThisLocation && selectedWeek
        },
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
            return this.timings.find(timing => jummah.timingID === timing._id)
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
        sameMonthAndYear(dateA, dateB) {
            return dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
        }
    },
    computed: {
        readyToShow() {
            return this.jummahs.length > 0
        },
        monthsFromCurrent() {
            return datetime.monthsFromDate(this.currentWeek, this.selectedWeek)
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
            if (this.monthsFromCurrent !== 0)
                return this.viewingMonthIsCurrentPastOrFuture
            if (this.selectedWeek.getTime() > this.currentWeek.getTime())
                return 'future'
            else if (this.selectedWeek.getTime() < this.currentWeek.getTime())
                return 'past'
            else
                return 'current'
        }
    },
    created() {
        this.currentWeek = new Date(this.selectedWeek)
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
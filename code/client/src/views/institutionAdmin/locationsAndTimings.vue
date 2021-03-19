<template>
    <div>
        <loading>
            <div v-if="readyToDisplay" class="locations-container">

                <!-- back to schedule -->
                <div>
                    <button 
                        class="purple back-to-schedule"
                        @click="$router.push('/institutionAdmin/schedule')"
                    >
                        Back to Schedule
                    </button>
                </div>
                <!-- ENDS HERE -->

                <!-- Location -->
                <collapsable-box
                    v-for="(location, locationIndex) in locations"
                    :key="locationIndex"
                    :headline="location.name"
                >
                    <p>Location Name</p>
                    <input 
                        type="text" 
                        v-model="location.name"
                        minlength="1"
                        @input="updateLocation(location, locationIndex)" 
                    ><br>
                    <p>Location Address</p>
                    <input 
                        type="text"
                        minlength="1" 
                        v-model="location.address"
                        @input="updateLocation(location, locationIndex)"
                    ><br>

                    <!-- Timing -->
                    <div 
                        v-for="(timing, timingIndex) in timings" 
                        :key="timingIndex"
                    >
                        <div
                            class="prayer-timing"
                            v-if="timingIsForThisLocation(location, timing)"
                        >
                            <p class="timing-label">
                                Prayer Time {{ prayerNumber(location, timing) }}
                            </p>
                            <timing-mutator
                                :timing="timing"
                                @changed="incrementTime($event, timingIndex)"
                            />
                            <button 
                                class="red timing-btns extra-margin"
                                @click="deleteTiming(timing, timingIndex)"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    <!-- ENDS HERE -->
                    
                    <!-- Add New Timing or Delete Location -->
                    <div>
                        <button
                            class="timing-btns large" 
                            @click="addTiming(location)"
                        >
                            New Timing
                        </button>
                    </div>
                    <div>
                        <button
                            class="red timing-btns delete-location-btn"
                            @click="deleteLocation(location, locationIndex)"
                        >
                            Delete this Location
                        </button>
                    </div>
                    <!-- ENDS HERE -->

                </collapsable-box>
                <!-- ENDS HERE -->

                <!-- Add new Location -->
                <div>
                    <button 
                        class="add-location-btn blue"
                        @click="addNewLocation()"
                    >
                        +
                    </button>
                </div>
                <!-- ENDS HERE -->

            </div>

            <!-- if request crashes or error -->
            <div v-else>
                <msg-with-pic 
                    :msg="`There was a problem retrieving your locations and timings`"
                    :gif="`sadCatStanding`"
                />
            </div>
            <!-- ENDS HERE -->

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'
import timingMutator from '@/components/general/timingMutator.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: 'editLocationAndTimings',
    components: {
        collapsableBox,
        loading,
        timingMutator,
        msgWithPic
    },
    data() {
        return {
            locations: [],
            timings: []
        }
    },
    methods: {
        async updateLocation(location, index) {
            await this.utils.delayedRequest(
                'locations',
                'updateLocation',
                { 
                    arguments: [location],
                    additionalIdentifiers: [index.toString()]
                }
            )
        },
        prayerNumber(location, timing) {
            const index = this.timingsForEachLocation[location._id].findIndex(time => time._id === timing._id)
            return  index + 1
        },
        async incrementTime($event, index) {
            this.timings[index][$event.type] += $event.increment
            await this.utils.delayedRequest(
                'timings', 
                'updateTiming', 
                { 
                    arguments: [this.timings[index]],
                    additionalIdentifiers: [index.toString()]
                }
            )
        },
        async addTiming(location) {
            const target = this.timingsForEachLocation[location._id].slice(-1)[0]
            const lastTimingOfLocation = { ...target }
            delete lastTimingOfLocation._id
            if (lastTimingOfLocation.minute !== 59)
                lastTimingOfLocation.minute++
            else {
                lastTimingOfLocation.hour++
                lastTimingOfLocation.minute = 0
            }
            try {
                const updated = await this.$API.timings.createNewTiming(lastTimingOfLocation) 
                this.timings.push(updated)
            } catch(err) {
                console.log(err)
            }
        },
        async deleteTiming(timing, index) {
            if (this.timingsForEachLocation[timing.locationID].length === 1)
                return this.utils.alert(`You must have at least one timing per location!`)
            const confirm = await this.utils.confirm(`Are you sure you want delete this timing?`)
            if (confirm) {
                const res = await this.$API.timings.deleteTiming(timing._id) 
                console.log(res)
                this.timings.splice(index, 1)
            }
        },
        timingIsForThisLocation(location, timing) {
            return timing.locationID === location._id
        },
        async deleteLocation(location, index) {
            if (this.locations.length <= 1)
                return this.utils.alert(`You must have at least one location`)
            const confirm = await this.utils.confirm(`Are you sure you want to delete this location?`)
            if (confirm) {
                const res = await this.$API.locations.deleteLocation(location._id)
                console.log(res)
                this.locations.splice(index, 1)
            }
        },
        async addNewLocation() {
            const newLocation = { ...this.locations[0] }
            delete newLocation._id
            const length = this.locations.length
            newLocation.name = `Unknown Location ${length}`
            newLocation.address = `Unknown Address ${length}`
            try {
                const { location, timing } = await this.$API.locations.createNewLocation(newLocation)
                this.locations.push(location)
                this.timings.push(timing)
            } catch(err) {
                console.log(err)
            }
        },
    },
    computed: {
        readyToDisplay() {
            return this.timings.length > 0 && this.locations.length > 0
        },
        timingsForEachLocation() {
            const locationToTimingIndex = {}
            this.locations.forEach(location => {
                locationToTimingIndex[location._id] = this.timings.filter(timing => timing.locationID === location._id)
            })
            return locationToTimingIndex
        }
    },
    async created() {
        const [locations, timings] = await this.$API.chainedRequests.getActiveLocationsAndTimings()
        this.locations = locations
        this.timings = timings
    }
}
</script>

<style lang="scss" scoped>
.locations-container {
    margin-top: 25px;
    width: 90%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

p {
    color: getColor("offWhite");
    font-size: 19px;
    font-weight: bold;
    margin-top: 2vh;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

input {
    border: none;
    outline: none;
    border-radius: 4px;
    height: 5vh;
    max-height: 55px;
    width: 80%;
    color: getColor("offWhite");
    margin-right: auto;
    margin-left: auto;
    font-size: 1.5vh;
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}

.prayer-timing {
    margin-top: 35px;
    margin-bottom: 35px;
    width: 65%;
    margin-left: auto;
    margin-right: auto;
    background: getColor("blue");
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15%;
    padding-right: 15%;
}

.timing-label {
    color: black;
}

button {
    max-height: 45px;
}

.delete-location-btn {
    width: 95%;
    max-width: 400px !important;
}

.timing-btns {
    max-width: 100px;
    max-height: 42px;
    font-size: 19px;
    &.large {
        max-width: 120px;
    }
    &.extra-margin {
        margin-top: 15px;
    }
}

.add-location-btn {
    margin-top: 30px;
    font-weight: bold;
    width: auto;
    max-width: 600px;
    max-height: 70px;
    font-size: 19px;
}

.back-to-schedule {
    max-width: 200px;
    font-size: 15px;
    max-height: 50px;
}

@media screen and (max-width: $phoneWidth) {
     p {
         font-size: 2.6vh;
         margin-top: 2vh;
     }

     .timing-btns {
        max-width: 70px;
        max-height: 42px;
        font-size: 2.5vh;
    }

    .prayer-timing {
        margin-top: 5vh;
        margin-bottom: 5vh;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
    }
}
</style>
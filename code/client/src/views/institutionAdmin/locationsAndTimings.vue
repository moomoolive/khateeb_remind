<template>
    <div>

        <div>
            <button 
                class="purple back-to-schedule"
                @click="$router.push('/institutionAdmin/schedule')"
            >
                Back to Schedule
            </button>
        </div>

        <loading>

            <div class="locations-container">

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

                    <div 
                        v-for="(timing, timingIndex) in timings.filter(t => t.locationID === location._id)" 
                        :key="timingIndex"
                    >
                        <div class="prayer-timing">
                            
                            <p class="timing-label">
                                Prayer Time {{ timingIndex + 1 }}
                            </p>
                            
                            <timing-mutator
                                :timing="timing"
                                @changed="incrementTime($event, timing)"
                            />

                            <button 
                                class="red timing-btns extra-margin"
                                @click="deleteTiming(timing)"
                            >
                                🗑️
                            </button>

                        </div>
                    </div>
                    
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
                            class="red timing-btns large"
                            @click="deleteLocation(location)"
                        >
                            Delete this Location
                        </button>
                    </div>

                </collapsable-box>

            </div>

            <div>
                <button 
                    class="add-location-btn blue"
                    @click="addNewLocation()"
                >
                    +
                </button>
            </div>

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'
import timingMutator from '@/components/general/timingMutator.vue'

export default {
    name: 'editLocationAndTimings',
    components: {
        collapsableBox,
        loading,
        timingMutator
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
        async incrementTime(incrementInfo={}, timing={}) {
            const index = this.findIndexById(timing._id)
            this.timings[index][incrementInfo.type] += incrementInfo.increment
            await this.utils.delayedRequest(
                'timings', 
                'updateTiming', 
                { 
                    arguments: [this.timings[index]],
                    additionalIdentifiers: [index.toString()]
                }
            )
        },
        async addNewLocation() {
            const length = this.locations.length
            try {
                const { location, timing } = await this.$API.locations.createNewLocation({ name: `Unknown Location ${length}`, address: `Unknown Address ${length}` })
                this.timings.push(timing[0])
                this.locations.push(location)
            } catch(err) {
                console.log(err)
            }
        },
        async addTiming(location) {
            const target = this.timings.find(t => t.locationID === location._id) || { hour: 12, minute: 29 }
            try {
                const newTiming = await this.$API.timings.createNewTiming({ 
                    locationID: location._id,
                    minute: target.minute === 59 ? 0 : target.minute + 1,
                    hour: target.minute === 59 ? target.hour + 1 : target.hour
                })
                this.timings.push(newTiming)
            } catch(err) {
                console.log(err)
            }
        },
        async deleteTiming(timing) {
            if (this.timings.filter(t => timing.locationID === t.locationID).length < 2)
                return this.utils.alert(`You must have at least one timing per location!`)
            const confirm = await this.utils.confirm(`Are you sure you want delete this timing?`)
            if (confirm) {
                const res = await this.$API.timings.deleteTiming(timing._id) 
                console.log(res)
                this.timings.splice(this.findIndexById(timing._id), 1)
            }
        },
        async deleteLocation(location) {
            if (this.locations.length < 2)
                return this.utils.alert(`You must have at least one location`)
            const confirm = await this.utils.confirm(`Are you sure you want to delete this location?`)
            if (confirm) {
                const res = await this.$API.locations.deleteLocation(location._id)
                console.log(res)
                this.locations.splice(this.findIndexById(location._id, 'locations'), 1)
                this.timings = this.timings.filter(t => t.locationID === location._id)
            }
        },
        findIndexById(id="123456789012345678901234", data="timings") {
            return this[data].findIndex(d => d._id === id)
        }
    },
    computed: {
        
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
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.back-to-schedule {
    max-width: 200px;
    font-size: 15px;
    max-height: 50px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
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
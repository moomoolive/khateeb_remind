<template>
    <div>
        <h2>Location Settings</h2>
        <button @click="saveLocations()">Save Locations</button>
        <h3 v-if="!hasInitializedLocations">
            You need to create at least one location, with one timing to<br>
            start setting your schedules
        </h3>
        <div v-for="(location, ID) in locations" :key="ID">
            <h4>{{ location.info.name || ID }}</h4>
            <div>
                Name: <input v-model="location.info.name">
                Address: <input v-model="location.info.address">
            </div>
            <div
            v-for="(timing, key) in location.timings"
            :key="key"
            style="padding-top: 20px"
            >
                Prayer Timing {{ key }}<br>
                <div 
                v-for="(value, property) in location.timings[key]"
                :key="property"
                style="display: inline;"
                >
                    <p>
                    <span @click="incrementTime({
                        property,
                        ID,
                        key
                    }, 1)">
                        +
                    </span><br>
                    {{ value }}<br>
                    <span @click="incrementTime({
                        property,
                        ID,
                        key
                    }, -1)">
                        -
                    </span>
                    </p>
                </div>
            </div>
            <button @click="addNewTiming(ID)">Add New Timing</button>
        </div>
        <button @click="addNewLocation()" style="margin-top: 20px">
            Add New Location
        </button>
    </div>
</template>

<script>
import API from '../../utils/apiCalls.js'

export default {
    name: "locationSettings",
    data() {
        return {
            hasInitializedLocations: true,
            locations: {
                location1: {
                    info: {
                        name: null,
                        address: null
                    },
                    timings: {
                        1: {
                            hour: 12,
                            minutes: '59',
                            timing: 'PM'
                        }, 
                        2: {
                            hour: 1,
                            minutes: '00',
                            timing: 'PM'
                        }
                    }
                }
            },
            ver: null,
            id: null
        }
    },
    methods: {
        // this needs to be completely redone... it's attrocious
        // also need to put checks to stop prayer 2 for example earlier than prayer 1
        // and not later than prayer
        incrementTime(info, value=null) {
            if (info.property === 'timing') {
                this.locations[info.ID].timings[info.key][info.property] === 'AM' ? this.locations[info.ID].timings[info.key][info.property] = 'PM' : this.locations[info.ID].timings[info.key][info.property] = 'AM'
            } else {
                if (info.property === 'hour') {
                    if (this.locations[info.ID].timings[info.key][info.property] + 1 >= 13 && value === 1) {
                    this.$set(this.locations[info.ID].timings[info.key], info.property, 1)
                    this.$nextTick(() => {
                        this.locations[info.ID].timings[info.key].timing === 'AM' ? this.locations[info.ID].timings[info.key].timing = 'PM' : this.locations[info.ID].timings[info.key].timing = 'AM'
                    })
                    } 
                    else if (this.locations[info.ID].timings[info.key][info.property] - 1 <= 0 && value === -1) {
                        this.$set(this.locations[info.ID].timings[info.key], info.property, 12)
                        this.$set( this.locations[info.ID].timings[info.key], 'timing', this.locations[info.ID].timings[info.key][info.timing] === 'AM' ? 'PM' : 'AM')
                        this.$nextTick(() => {
                            this.locations[info.ID].timings[info.key].timing === 'AM' ? this.locations[info.ID].timings[info.key].timing = 'PM' : this.locations[info.ID].timings[info.key].timing = 'AM'
                        })
                    } else {
                        this.$set(this.locations[info.ID].timings[info.key], info.property, this.locations[info.ID].timings[info.key][info.property] + value)
                    }
                } else {
                    const nonStringMinutes = parseInt(this.locations[info.ID].timings[info.key][info.property])
                    if (nonStringMinutes + 1 >= 60 && value === 1) {
                        console.log('hi')
                        this.$set(this.locations[info.ID].timings[info.key], info.property, '00')
                        this.$nextTick(() => {
                            if (this.locations[info.ID].timings[info.key].hour + 1 >= 13) {
                                this.$set(this.locations[info.ID].timings[info.key], 'hour', 1)
                            } else {
                                this.$set(this.locations[info.ID].timings[info.key], 'hour', this.locations[info.ID].timings[info.key][info.property] + 1)
                            }
                            
                        })
                    }
                    else if (nonStringMinutes - 1 <= -1 && value === -1) {
                        this.$set(this.locations[info.ID].timings[info.key], info.property, '59')
                        this.$nextTick(() => {
                            if (this.locations[info.ID].timings[info.key].hour - 1 <= 0) {
                                this.$set(this.locations[info.ID].timings[info.key], 'hour', 12)
                            } else {
                                this.$set(this.locations[info.ID].timings[info.key], 'hour', this.locations[info.ID].timings[info.key][info.property] - 1)
                            }
                        })
                    } else { 
                        const number = this.nonStringMinutes(this.locations[info.ID].timings[info.key].minutes, value)
                        this.$set(this.locations[info.ID].timings[info.key], info.property, number)
                    }
                }
            }
        },
        nonStringMinutes(value, increment) {
            const parsedValue = parseInt(value)
            const x = parsedValue + increment
            return parsedValue < 9 ? `0${x}` : `${x}`
        },
        addNewTiming(ID) {
            const numberOfTimings = Object.keys(this.locations[ID].timings).length
            const lastTimingEntry = numberOfTimings
            this.$set(this.locations[ID].timings, parseInt(numberOfTimings) + 1, {
                hour: this.locations[ID].timings[lastTimingEntry].hour,
                minutes: `${this.nonStringMinutes(this.locations[ID].timings[lastTimingEntry].minutes, 1)}`,
                timing: this.locations[ID].timings[lastTimingEntry].timing
            })
        },
        addNewLocation() {
            const numberOfLocations = Object.keys(this.locations).length
            const emptyLocation = {
                    info: {
                        name: null,
                        address: null
                    },
                    timings: {
                        1: {
                            hour: 12,
                            minutes: '59',
                            timing: 'PM'
                        }, 
                        2: {
                            hour: 1,
                            minutes: '00',
                            timing: 'PM'
                        }
                    }
            }
            this.$set(this.locations, `location${numberOfLocations + 1}`, emptyLocation)
        },
        async saveLocations() {
            await API.saveLocationAndTiming(this.$store.state.JWT_TOKEN, this.locations, this.ver, this.id)
        }
    },
    async created() {
        const locations =  await API.getLocationAndTiming(this.$store.state.JWT_TOKEN)
        if (locations) {
            console.log(locations)
            this.locations = locations.options
            this.ver = locations.__v 
            this.id = locations._id
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
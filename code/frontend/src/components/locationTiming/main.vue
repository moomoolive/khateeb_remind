<template>
    <div>
        <h2>Location Settings</h2>
        <button @click="saveLocations()" :disabled="isSame || emptyNameOrAddress">
            Save Locations
        </button>
        <h3 v-if="!hasInitializedLocations">
            You need to create at least one location, with one timing to<br>
            start setting your schedules
        </h3>
        <div v-for="(location, locationIndex) in inputData.options" :key="locationIndex">
            <h4>{{ location.info.name || `Location ${locationIndex + 1}` }}</h4>
            <h5>{{ location.info.address || `My Backyard` }}</h5>
            <div>
                Name: <input v-model="location.info.name">
                Address: <input v-model="location.info.address">
            </div>
            <div
            v-for="(timing, timingIndex) in location.timings"
            :key="timingIndex"
            style="padding-top: 20px"
            >
                Prayer Timing {{ timingIndex + 1 }}<br>
                <div 
                v-for="(value, property) in location.timings[timingIndex]"
                :key="property"
                style="display: inline;"
                >
                    <p>
                        <button 
                        @click="incrementTime({property, locationIndex, timingIndex }, 1)"
                        >
                            +
                        </button><br>
                        {{ value }}<br>
                        <button
                        @click="incrementTime({ property, locationIndex, timingIndex }, -1)"
                        >
                            -
                        </button>
                    </p>
                </div>
                <div>
                    <button @click="deleteTiming(locationIndex, timingIndex)">Delete This Timing</button>
                </div>
                <div>
                    <button @click="addNewTiming(locationIndex, timingIndex)">Add New Timing</button>
                </div>
            </div>
            <div style="padding-top: 20px">
                    <button @click="deleteLocation(locationIndex)">Delete This Location</button>
            </div>
        </div>
        <button @click="addNewLocation()" style="margin-top: 20px">
            Add New Location
        </button>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

export default {
    name: "locationSettingsMain",
    data() {
        return {
            hasInitializedLocations: true,
            inputData: {
                name: 'locations&Timing',
                options: [
                    {
                        info: {
                            name: '',
                            address: ''
                        },
                        timings: [
                            {
                                hour: 12,
                                minutes: '00',
                                AMorPM: 'PM'
                            }, 
                            {
                                hour: 1,
                                minutes: '00',
                                AMorPM: 'PM'
                            }
                        ]
                    }
                ],
            },
            cachedLocations: []
        }
    },
    methods: {
        incrementTime(info, value=null) {
            if (info.property === 'hour') this.incrementHour(info, value)
            else if (info.property === 'minutes') this.incrementMinutes(info, value)
            else this.changeAMPM(info)
        },
        incrementHour(info, value) {
            const previousHour = this.inputData.options[info.locationIndex].timings[info.timingIndex].hour
            this.inputData.options[info.locationIndex].timings[info.timingIndex].hour = previousHour + value
            const currentHour = this.inputData.options[info.locationIndex].timings[info.timingIndex].hour
            if (currentHour >= 13) {
                this.inputData.options[info.locationIndex].timings[info.timingIndex].hour = 1
            }
            else if (currentHour <= 0) {
                this.inputData.options[info.locationIndex].timings[info.timingIndex].hour = 12
            }
            else if (currentHour === 12 || previousHour === 12) this.changeAMPM(info)
        },
        incrementMinutes(info, value) {
            const previousMinute = parseInt(this.inputData.options[info.locationIndex].timings[info.timingIndex].minutes)
            this.inputData.options[info.locationIndex].timings[info.timingIndex].minutes = this.nonStringMinutes(previousMinute, value)
            const currentMinute = this.inputData.options[info.locationIndex].timings[info.timingIndex].minutes
            const currentHour = this.inputData.options[info.locationIndex].timings[info.timingIndex].hour
            if (currentMinute >= '60') {
                this.inputData.options[info.locationIndex].timings[info.timingIndex].minutes = '00'
                this.incrementHour(info, value)
            }
            else if (currentMinute <= '-1') {
                this.inputData.options[info.locationIndex].timings[info.timingIndex].minutes = '59'
                this.incrementHour(info, value)
            }
        },
        changeAMPM(info) {
            const value = this.inputData.options[info.locationIndex].timings[info.timingIndex].AMorPM
                if (value === 'AM') {
                    this.inputData.options[info.locationIndex].timings[info.timingIndex].AMorPM = 'PM'
                } else this.inputData.options[info.locationIndex].timings[info.timingIndex].AMorPM = 'AM'
        },
        nonStringMinutes(parsedValue, increment) {
            const x = parsedValue + increment
            return x <= 9 && x >= 0 ? `0${x}` : `${x}`
        },
        addNewTiming(locationIndex, timingIndex) {
            const mins = this.nonStringMinutes(parseInt(this.inputData.options[locationIndex].timings[timingIndex].minutes), 1)
            const newTiming = {
                hour: this.inputData.options[locationIndex].timings[timingIndex].hour,
                minutes: mins,
                AMorPM: this.inputData.options[locationIndex].timings[timingIndex].AMorPM
            }
            this.inputData.options[locationIndex].timings.splice(timingIndex + 1, 0, newTiming)
        },
        deleteTiming(locationIndex, timingIndex) {
            if (this.inputData.options[locationIndex].timings.length === 1) {
                const name = this.inputData.options[locationIndex].info.name
                alert(`You must have at least one timing at ${name}!`)
            } else {
                this.inputData.options[locationIndex].timings.splice(timingIndex, 1)
            }
        },
        addNewLocation() {
            const emptyLocation = {
                    info: {
                        name: '',
                        address: ''
                    },
                    timings: [
                        {
                            hour: 12,
                            minutes: '00',
                            AMorPM: 'PM'
                        }, 
                        {
                            hour: 1,
                            minutes: '00',
                            AMorPM: 'PM'
                        }
                    ]
                }
            this.inputData.options.push(emptyLocation)
        },
        deleteLocation(locationIndex) {
            this.inputData.options.splice(locationIndex, 1)
        },
        async saveLocations() {
            await this.$API.updateLocationAndTiming(this.inputData)
        }
    },
    computed: {
        isSame() {
            for (let x = 0; x < this.inputData.options.length; x++) {
                if (!equal(this.inputData.options[x], this.cachedLocations[x])) return false
            }
            return true && this.sameNumberOfLocations
        },
        sameNumberOfLocations() {
            return this.inputData.options.length === this.cachedLocations.length
        },
        emptyNameOrAddress() {
            for (let location of this.inputData.options) {
                let name = location.info.name
                let address = location.info.address
                if (name === '' || address === '') return true
            }
            return false
        }
    },
    async created() {
        const locations =  await this.$API.getLocationAndTiming('locations&Timing')
        if (locations) {
            this.inputData = locations
            this.cachedLocations = JSON.parse(JSON.stringify(this.inputData.options))
        } else this.hasInitializedLocations = false
    }
}
</script>

<style lang="scss" scoped>

</style>
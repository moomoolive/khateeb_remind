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
                <timing-incrementer
                :timingIndex="timingIndex"
                :location="location"
                :locationIndex="locationIndex"
                :inputData="inputData"
                />
                <add-delete-timing-buttons
                :timingIndex="timingIndex"
                :locationIndex="locationIndex"
                :inputData="inputData"
                />
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
import timingIncrementer from './timingIncrementer.vue'
import addDeleteTimingButtons from './addDeleteTimingButtons.vue'

export default {
    name: "locationSettingsMain",
    components: {
        timingIncrementer,
        addDeleteTimingButtons
    },
    data() {
        return {
            hasInitializedLocations: true,
            inputData: {
                name: 'locations&Timing',
                options: [ ],
            },
            emptyLocation: {},
            cachedLocations: []
        }
    },
    methods: {
        addNewLocation() {
            const newLocation = JSON.parse(JSON.stringify(this.emptyLocation))
            this.inputData.options.push(newLocation)
        },
        deleteLocation(locationIndex) {
            this.inputData.options.splice(locationIndex, 1)
        },
        async saveLocations() {
            await this.$API.updateLocationAndTiming(this.inputData)
        },
        loadInPreviousEntries(previousEntries) {
            this.inputData = previousEntries
            this.cachedLocations = JSON.parse(JSON.stringify(this.inputData.options))
        },
        loadInEmpty(emptySchema) {
            this.hasInitializedLocations = false
            this.inputData.options.push(emptySchema)
        },
        async loadAPIData() {
            const locations =  await this.$API.getLocationAndTiming('locations&Timing')
            if (locations.previousEntries) this.loadInPreviousEntries(locations.previousEntries)
            else this.loadInEmpty(locations.emptySchema)
            this.emptyLocation = JSON.parse(JSON.stringify(locations.emptySchema))
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
    created() {
        this.loadAPIData()
    }
}
</script>

<style lang="scss" scoped>

</style>
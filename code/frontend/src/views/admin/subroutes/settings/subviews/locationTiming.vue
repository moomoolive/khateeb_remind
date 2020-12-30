<template>
    <div>
        <h3 v-if="!hasInitializedLocations">
            You need to create at least one location, with one timing to<br>
            start setting your schedules
        </h3>
        <button
            @click="save()"
            :disabled="isDisabled"
            class="grey"
        >
            Save
        </button>
        <collapsable-box
            v-for="(location, locationIndex) in inputData.options" 
            :key="locationIndex"
            :headline="location.info.name || `Location ${locationIndex + 1}`"
        >
            <template v-slot:content>
                <div class="location">
                    <button
                        class="red"
                        @click="deleteLocation(locationIndex)"
                    >
                        Delete This Location
                    </button>
                    <div>
                        Name: <input v-model="location.info.name"><br><br>
                        Address: <input v-model="location.info.address">
                    </div>
                    <div
                        class="timing"
                        v-for="(timing, timingIndex) in location.timings"
                        :key="timingIndex"
                        style="display: inline;"
                    >
                        <h3>Prayer Timing {{ timingIndex + 1 }}</h3><br>
                        <timing-incrementer
                            :timingIndex="timingIndex"
                            :location="location"
                            :locationIndex="locationIndex"
                            :inputData="inputData"
                        />
                        <button
                            @click="deleteTiming(locationIndex, timingIndex)"
                            class="yellow"
                        >
                            Delete This Timing
                        </button>
                        <button
                            @click="addNewTiming(locationIndex, timingIndex)"
                        >
                            Add Timing Here
                        </button>
                    </div>
                </div>
            </template>
        </collapsable-box>
        <button
            class="new"
            @click="addNewLocation()"
        >
            Add New Location
        </button>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

import timingIncrementer from '@/components/misc/timingIncrementer.vue'

export default {
    name: "locationSettingsMain",
    components: {
        timingIncrementer
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
            const newLocation = this._.deepCopy(this.emptyLocation)
            this.inputData.options.push(newLocation)
        },
        async save() {
            const response = await this.$API.admin.updateSetting(this.inputData)
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
        loadInPreviousEntries(previousEntries) {
            this.inputData = previousEntries[0]
            this.cachedLocations = this._.deepCopy(this.inputData.options)
        },
        loadInEmpty(emptySchema) {
            this.hasInitializedLocations = false
            this.inputData = emptySchema
        },
        async loadAPIData() {
            const locations =  await this.$API.admin.getSetting('locationAndTimings')
            console.log(locations)
            if (locations.previousEntries[0]) this.loadInPreviousEntries(locations.previousEntries)
            else this.loadInEmpty(locations.emptySchema)
            this.emptyLocation = this._.deepCopy(locations.emptySchema.options[0])
        },
        deleteLocation(locationIndex) {
            this.inputData.options.splice(locationIndex, 1)
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
        }
    },
    computed: {
        currentSchedule() {
            return this.inputData.options
        },
        isSame() {
            for (let x = 0; x < this.currentSchedule.length; x++) {
                if (!equal(this.currentSchedule[x], this.cachedLocations[x])) return false
            }
            return true && this.sameNumberOfLocations
        },
        sameNumberOfLocations() {
            return this.currentSchedule.length === this.cachedLocations.length
        },
        emptyNameOrAddress() {
            for (let location of this.inputData.options) {
                let name = location.info.name
                let address = location.info.address
                if (name === '' || address === '') return true
            }
            return false
        },
        isDisabled() {
            return this.isSame || this.emptyNameOrAddress
        }
    },
    created() {
        this.loadAPIData()
    }
}
</script>

<style lang="scss" scoped>
.new {
    margin-top: 2.5vh;
}

.location {
    padding-top: 20px;
    padding-bottom: 20px;
}

.timing {
    padding-top: 20px; 
}
</style>
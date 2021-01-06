<template>
    <div>
        <h3 v-if="!hasInitializedLocations">
            You need to create at least one location, with one timing to<br>
            start setting your schedules
        </h3>
        <button
            @click="$emit('submitted', inputData)"
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
                        :dateString="location.timings[timingIndex]"
                        @changed="$set(location.timings, timingIndex, $event)"
                    />
                </div>
                <button @click="addNewTiming(location)">
                    Add a Prayer Timing
                </button>
                <button
                    class="red"
                    @click="deleteTiming(location)"
                >
                    Delete a Prayer Timing
                </button>
            </div>
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
    props: {
        previousEntries: {
            type: Array,
            required: true
        },
        emptySchema: {
            type: Object,
            required: true
        }
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
        changeTiming(timing, changedTiming) {
            timing = new Date(this._.deepCopy(changedTiming))
        },
        addNewLocation() {
            const newLocation = this._.deepCopy(this.emptyLocation)
            this.inputData.options.push(newLocation)
        },
        loadInPreviousEntries(previousEntries) {
            this.inputData = this._.deepCopy(previousEntries)
            this.cachedLocations = this._.deepCopy(this.inputData.options)
        },
        loadInEmpty(emptySchema) {
            this.hasInitializedLocations = false
            this.inputData = this._.deepCopy(emptySchema)
        },
        loadAPIData() {
            if (this.previousEntries[0]) this.loadInPreviousEntries(this.previousEntries[0])
            else this.loadInEmpty(this.emptySchema)
            this.emptyLocation = this._.deepCopy(this.emptySchema.options[0])
        },
        deleteLocation(locationIndex) {
            this.inputData.options.splice(locationIndex, 1)
        },
        nonStringMinutes(parsedValue, increment) {
            const x = parsedValue + increment
            return x <= 9 && x >= 0 ? `0${x}` : `${x}`
        },
        addNewTiming(location) {
            const timing = location.timings[location.timings.length - 1]
            location.timings.push(timing)
        },
        deleteTiming(location) {
            location.timings.pop()
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
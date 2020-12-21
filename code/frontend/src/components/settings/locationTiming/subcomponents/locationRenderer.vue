<template>
    <div style="padding-top: 20px; padding-bottom: 20px;">
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
            v-for="(timing, timingIndex) in location.timings"
            :key="timingIndex"
            style="padding-top: 20px; display: inline;"
            >
                <h3>Prayer Timing {{ timingIndex + 1 }}</h3><br>
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
    </div>
</template>

<script>
import timingIncrementer from './timingIncrementer.vue'
import addDeleteTimingButtons from './addDeleteTimingButtons.vue'

export default {
    name: 'locationRenderer',
    components: {
        timingIncrementer,
        addDeleteTimingButtons
    },
    props: {
        location: {
            type: Object,
            required: true
        },
        locationIndex: {
            type: [String, Number],
            required: true
        },
        inputData: {
            type: Object,
            required: true
        }
    },
    methods: {
        deleteLocation(locationIndex) {
            this.inputData.options.splice(locationIndex, 1)
        }
    }
}
</script>

<style>

</style>
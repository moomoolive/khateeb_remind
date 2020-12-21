<template>
    <div>
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
</template>

<script>
export default {
    name: 'addDeleteTimingButtons',
    props: {
        timingIndex: {
            type: [String, Number],
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
    }
}
</script>

<style>

</style>
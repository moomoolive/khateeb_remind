<template>
    <div>
        <cool-btn
            style="padding-top: 10px;"
            @pushed="deleteTiming(locationIndex, timingIndex)"
            color="yellow"
            buttonText="Delete This Timing"
        />
        <cool-btn
            style="padding-top: 10px;"
            @pushed="addNewTiming(locationIndex, timingIndex)"
            buttonText="Add Timing Here"
        />
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
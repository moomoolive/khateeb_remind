<template>
    <div>
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
    </div>
</template>

<script>
export default {
    name: 'timingIncrementer',
    props: {
        timingIndex: {
            type: [String, Number],
            required: true
        },
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
        }
    }
}
</script>

<style>

</style>
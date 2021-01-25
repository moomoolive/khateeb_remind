<template>
    <div class="container">
        <div class="display">
            <button @click="incrementHour(1)">+</button>
            <p>{{ hour }}</p>
            <button class="red" @click="incrementHour(-1)">-</button>
        </div>
        <div class="display">
            <button @click="incrementMinute(1)">+</button>
            <p>{{ minute }}</p>
            <button class="red" @click="incrementMinute(-1)">-</button>
        </div>
        <div class="display">
            <button>+</button>
            <p>{{ amOrPm }}</p>
            <button>-</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'timingMutator',
    props: {
        timing: {
            type: Object,
            required: true
        }
    },
    methods: {
        incrementHour(increment) {
            if ((increment === -1 && this.timing.hour === 0) || (increment === 1 && this.timing.hour === 23))
                return
            this.$emit('changed', { type: 'hour', increment, timing: this.timing })
        },
        incrementMinute(increment) {
            if ((increment === -1 && this.timing.minute === 0) || (increment === 1 && this.timing.minute === 59))
                return
            this.$emit('changed', { type: 'minute', increment, timing: this.timing })
        }
    },
    computed: {
        amOrPm() {
            return this.timing.hour > 11 ? 'PM' : 'AM'
        },
        hour() {
            if (this.timing.hour === 0)
                return 12
            else
                return this.timing.hour > 12 ? this.timing.hour - 12 : this.timing.hour
        },
        minute() {
            return this.timing.minute < 10 ? `0${this.timing.minute}` : this.timing.minute
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
}
</style>
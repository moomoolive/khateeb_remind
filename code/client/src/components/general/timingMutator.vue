<template>
    <div class="container">

        <div class="display">
            <button :class="elementSize" @click="incrementHour(1)">+</button>
            <p :class="`${textColor} ${elementSize}`">{{ hour }}</p>
            <button :class="`red ${elementSize}`" @click="incrementHour(-1)">-</button>
        </div>
        <div class="display">
            <button :class="elementSize" @click="incrementMinute(1)">+</button>
            <p :class="`${textColor} ${elementSize}`">{{ minute }}</p>
            <button :class="`red ${elementSize}`" @click="incrementMinute(-1)">-</button>
        </div>
        <div class="display">
            <p :class="`am-pm ${textColor} ${elementSize}`">{{ amOrPm }}</p>
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
        },
        textColor: {
            type: String,
            required: false,
            default: 'none'
        },
        elementSize: {
            type: String,
            required: false,
            default: 'none'
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
    align-items: center;
    justify-content: center;
}

.am-pm {
    margin-right: 40%;
}

p {
    font-size: 20px;
    &.black {
        color: black;
    }
    &.white {
        color: getColor("offWhite");
    }
    &.small {
        font-size: 15px;
    }
}

button {
    font-size: 15px;
    font-weight: bold;
    &.small {
        font-size: 12px;
    }
}

@media screen and (max-width: $phoneWidth) {
    p {
        font-size: 3.5vh;
    }
    button {
        font-size: 2.7vh;
    }
}
</style>
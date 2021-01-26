<template>
    <div>
        <button 
            class="yellow"
            @click="changeMonth(-1)"
        >
            Previous Month
        </button>
        <button
            class="yellow"
            @click="changeMonth(1)"
        >
            Next Month
        </button>
    </div>
</template>

<script>
export default {
    name: 'changeMonthKhateebSchedule',
    props: {
        originalDate: {
            type: Date,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    },
    methods: {
        changeMonth(increment) {
            if (this.maximumFutureScheduling && increment === 1) {
                this._.alert(`You can't schedule more than one month ahead!`)
                return
            }
            const date = new Date(this.date)
            date.setDate(1)
            const data = new Date(date.setMonth(date.getMonth() + increment))
            this.$emit('changed', data)
        }
    },
    computed: {
        maximumFutureScheduling() {
            const twoMonthsAhead = new Date(this.originalDate)
            twoMonthsAhead.setDate(1)
            twoMonthsAhead.setMonth(twoMonthsAhead.getMonth() + 2)
            const next = new Date(this.date)
            next.setMonth(next.getMonth() + 1)
            return next.getTime() >= twoMonthsAhead.getTime()
        }
    }
}
</script>

<style>

</style>
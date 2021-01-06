<template>
    <div>
        <button
            v-for="(fridayDate, index) of fridayDates"
            :key="index"
            @click="click(fridayDate)"
            :aria-label="`view schedule for ${display.month} ${fridayDate}`"
        >
            {{ `${display.abbreviatedMonthName} ${buttonDisplay(fridayDate)}` }}
        </button>
    </div>
</template>

<script>
export default {
    name: 'changeWeekButtons',
    props: {
        fridayDates: {
            type: Array,
            required: true
        },
        display: {
            type: Object,
            required: true
        }
    },
    methods: {
        click(value) {
            this.$emit('change', { weekOf: value })
        },
        buttonDisplay(dateString) {
            return new Date(dateString).getDate()
        }
    }
}
</script>

<style>

</style>
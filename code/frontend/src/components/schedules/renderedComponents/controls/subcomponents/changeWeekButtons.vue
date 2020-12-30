<template>
    <div>
        <button
            v-for="fridayDate of fridayDates"
            :key="fridayDate"
            @click="click(fridayDate)"
            :aria-label="`view schedule for ${display.month} ${fridayDate}`"
        >
            {{ `${display.abbreviatedMonthName} ${fridayDate}` }}
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
        }
    }
}
</script>

<style>

</style>
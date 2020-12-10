<template>
    <div>
        <button
        v-for="fridayDate of fridayDates"
        :key="fridayDate"
        @click="click(fridayDate)"
        :aria-label="`view schedule for ${displayedMonthInfo.month} ${fridayDate}`"
        >
            {{ displayedMonthInfo.abbreviatedMonthName }} {{ fridayDate }}
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
        displayedMonthInfo: {
            type: Object,
            required: true
        }
    },
    methods: {
        click(value) {
            this.$emit('change', value)
        }
    }
}
</script>

<style>

</style>
<template>
    <div>
        <cool-btn
        v-for="fridayDate of fridayDates"
        :key="fridayDate"
        @pushed="click(fridayDate)"
        :aria-label="`view schedule for ${displayedMonthInfo.month} ${fridayDate}`"
        :buttonText="`${displayedMonthInfo.abbreviatedMonthName} ${fridayDate}`"
        style="display: inline; margin-left: 3px; margin-right: 3px;"
        />
    </div>
</template>

<script>
import CoolButton from '../../globalComponents/coolButton.vue'
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
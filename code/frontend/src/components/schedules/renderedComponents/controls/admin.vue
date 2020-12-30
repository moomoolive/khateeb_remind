<template>
    <div>
        <change-week-buttons
            :fridayDates="fridayDates"
            :display="display"
            @change="$emit('change', $event)"
            class="controlSplit"
        />
        <change-location-buttons
            :currentSchedule="currentSchedule"
            @change="$emit('change', $event)"
        />
    </div>
</template>

<script>
import changeWeekButtons from './subcomponents/changeWeekButtons.vue'
import changeLocationButtons from './subcomponents/changeLocationButtons.vue'

export default {
    name: 'adminScheduleControl',
    components: {
        changeWeekButtons,
        changeLocationButtons
    },
    props: {
        fridayDates: {
            type: Array,
            required: true
        },
        currentSchedule: {
            type: Object,
            required: true
        },
        display: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/scheduleControls.scss';
</style>
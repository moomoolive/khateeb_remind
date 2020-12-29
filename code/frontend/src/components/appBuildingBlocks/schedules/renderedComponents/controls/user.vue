<template>
    <div>
        <slider-button
            class="controlSplit"
            leftMessage="This Week"
            rightMessage="This Month"
            altText="Toggle between weekly and monthly view"
            @slider-toggled="toWeeklyView()"
        />
        <change-week-buttons
            class="controlSplit"
            :fridayDates="fridayDates"
            :display="display"
            v-if="!isWeeklyView"
            @change="$emit('change', $event)"
        />
        <change-location-buttons
            :currentSchedule="currentSchedule"
            v-if="currentSchedule.data.rows.length > 1"
            @change="$emit('change', $event)"
        />
    </div>
</template>

<script>
import changeWeekButtons from './subcomponents/changeWeekButtons.vue'
import changeLocationButtons from './subcomponents/changeLocationButtons.vue'

export default {
    name: 'userScheduleControl',
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
    },
    data() {
        return {
            isWeeklyView: true
        }
    },
    methods: {
        toWeeklyView() {
            this.$emit('change', { weekOf: this.$store.state.date.upcomingFriday.date })
            this.isWeeklyView = !this.isWeeklyView
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/scheduleControls.scss';
</style>
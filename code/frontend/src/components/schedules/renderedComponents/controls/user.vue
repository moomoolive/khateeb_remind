<template>
    <div>
        <slider-button
            class="controlSplit display"
            :basedOn="isWeeklyView"
            :offMsg="`This Month`"
            :onMsg="`This Week`"
            :altText="`Toggle between weekly and monthly view`"
            :untoggledColor="`yellow`"
            @toggled="toWeeklyView($event)"
        />
        <transition name="dropdown">
            <change-week-buttons
                class="controlSplit"
                :fridayDates="fridayDates"
                :display="display"
                v-if="!isWeeklyView"
                @change="$emit('change', $event)"
            />
        </transition>
        <change-location-buttons
            :currentSchedule="currentSchedule"
            v-if="currentSchedule.data.length > 1"
            @change="$emit('change', $event)"
        />
    </div>
</template>

<script>
import changeWeekButtons from './subcomponents/changeWeekButtons.vue'
import changeLocationButtons from './subcomponents/changeLocationButtons.vue'
import datetime from '@/utils/dateTime/main.js'

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
        toWeeklyView($event) {
            this.isWeeklyView = $event
            this.$emit('change', { weekOf: datetime.upcomingFriday(true).toUTCString() }) 
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/scheduleControls.scss';

.display {
    margin-top: 4vh;
}
</style>
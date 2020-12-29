<template>
    <div class="controls">
        <component
            class="display"
            :is="componentX"
            :display="display"
            :currentSchedule="currentSchedule"
            :fridayDates="fridayDates"
            @change="$emit('change', $event)"
        />
    </div>
</template>

<script>
export default {
    name: "controlRenderer",
    props: {
        table: {
            type: String,
            required: true
        },
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
    computed: {
        componentX() {
            return () => import(`@/components/appBuildingBlocks/schedules/renderedComponents/controls/${this.table}.vue`)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/components/scheduleControls.scss";

.display {
    margin-top: 4vh;
}
</style>
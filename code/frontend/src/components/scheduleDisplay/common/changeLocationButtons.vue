<template>
    <div>
        <button
        @click="click('All')"
        aria-label="view schedule for all locations"
        >
            All locations
        </button>
        <button
        v-for="(prayerLocationData, location_ID) in currentSchedule.data.rows"
        :key="location_ID"
        @click="click(location_ID)"
        :aria-label="`view schedule for ${prayerLocationData.info.name}`"
        >
            {{ prayerLocationData.info.name }}
        </button>
    </div>
</template>

<script>
export default {
    name: "changeLocationButtons",
    props: {
        currentSchedule: {
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
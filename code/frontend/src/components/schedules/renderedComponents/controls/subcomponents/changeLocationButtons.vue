<template>
    <div>
        <button
            @click="click('All')"
            aria-label="view schedule for all locations"
            class="blue"
            style="margin-bottom: 1vh;"
        >
            All locations
        </button>
        <br>
        <button
            v-for="(prayerLocationData, location_ID) in currentSchedule.data.rows"
            :key="location_ID"
            @click="click(location_ID)"
            :aria-label="`view schedule for ${prayerLocationData.info.name}`"
            :buttonText="prayerLocationData.info.name"
            class="grey"
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
            this.$emit('change', { location: value })
        }
    }
}
</script>

<style>
</style>
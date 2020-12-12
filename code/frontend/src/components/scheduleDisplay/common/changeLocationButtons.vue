<template>
    <div style="margin-bottom: 4vh; margin-top: 5vh;">
        <cool-btn
        @pushed="click('All')"
        aria-label="view schedule for all locations"
        buttonText="All locations"
        color="blue"
        style="margin-bottom: 1vh;"
        />
        <cool-btn
        v-for="(prayerLocationData, location_ID) in currentSchedule.data.rows"
        :key="location_ID"
        @pushed="click(location_ID)"
        :aria-label="`view schedule for ${prayerLocationData.info.name}`"
        :buttonText="prayerLocationData.info.name"
        color="grey"
        class="individualLocations"
        />
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
.individualLocations {
    display: inline;
    margin-left: 3px;
    margin-right: 3px;
}

</style>
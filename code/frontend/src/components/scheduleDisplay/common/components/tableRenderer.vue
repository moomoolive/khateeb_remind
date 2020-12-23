<template>
    <div>
        <table
            v-for="(prayerLocation, locationID) in shownLocations"
            :key="locationID"
            style="width: 95%;"
            class="tableBackground"
        >
            <tr>
                <th
                    colspan="2"
                    class="locationName"
                >{{ prayerLocation.info.name }}</th>
            </tr>
            <tr>
                <th
                    v-for="columnNames in schedule.data.columnData"
                    :key="columnNames"
                    class="columnIdentifiers"
                >
                    {{columnNames}}
                </th>
            </tr>
            <tr v-for="(khateeb, prayerTiming) in prayerLocation.monthlySchedule[displayedWeek]" :key="prayerTiming">
                <th class="khateebs">
                    {{ `${prayerLocation.timings[prayerTiming].hour}:${prayerLocation.timings[prayerTiming].minutes}${prayerLocation.timings[prayerTiming].AMorPM}` }}
                </th>
                <th class="khateebs">
                    <component
                    :is="table"
                    :displayedWeek="displayedWeek"
                    :schedule="schedule.data.rows[locationID]"
                    :prayerTiming="prayerTiming"
                    :originalSchedule="
                        !originalSchedule ? null : originalSchedule.data.rows[locationID]
                    "
                    @no-khateebs="$emit('no-khateebs')"
                    />
                </th>
            </tr>
            <tr>
                <th
                    colspan="2"
                    class="locationAddress"
                >
                    Location: {{ prayerLocation.info.address }}
                </th>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'tableRender',
    components: {
        'admin': () => import('@/components/scheduleDisplay/khateebCell/admin.vue'),
        'user': () => import('@/components/scheduleDisplay/khateebCell/user.vue')
    },
    props: {
        table: {
            type: String,
            required: true
        },
        shownLocations: {
            type: [Array, Object],
            required: true
        },
        schedule: {
            type: Object,
            required: true
        },
        displayedWeek: {
            type: [Number, String],
            required: true
        },
        originalSchedule: {
            type: [Object],
            required: false
        }
    },
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/scheduleTables.scss';
</style>
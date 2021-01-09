<template>
    <div>
        <table
            v-for="(prayerLocation, locationID) in shownLocations"
            :key="locationID"
            class="table"
        >
            <tr>
                <th
                    colspan="2"
                    class="locationName"
                >{{ prayerLocation.info.name }}</th>
            </tr>
            <tr>
                <th
                    v-for="columnNames in columnData"
                    :key="columnNames"
                    class="columnIdentifiers"
                >
                    {{ columnNames }}
                </th>
            </tr>
            <tr v-for="(prayer, prayerTiming) in prayerLocation.monthlySchedule[displayedWeek].timings" :key="prayerTiming">
                <th class="timings">
                    {{ dateDisplay(prayer) }}
                </th>
                <th class="khateebs">
                    <component
                        :is="cellType()"
                        :displayedWeek="displayedWeek"
                        :schedule="schedule.data[locationID]"
                        :prayerTiming="prayerTiming"
                        :originalSchedule="
                            !originalSchedule ? null : originalSchedule.data[locationID]
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
    name: 'tableRenderer',
    components: {
        'user': () => import('./tableCells/user.vue'),
        'admin': () => import('./tableCells/admin.vue')
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
            columnData: ['Timing', 'Khateeb']
        }
    },
    methods: {
        dateDisplay(dateString) {
            const date = new Date(dateString)
            const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
            const amOrPm = date.getHours() > 11 ? 'PM' : 'AM'
            return `${hour}:${minutes} ${amOrPm}`
        },
        cellType() {
            const date = new Date(this.displayedWeek).getTime()
            if (this.table !==  'admin')
                return this.table
            if (date < new Date().getTime())
                return 'user'
            else
                return 'admin'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/scheduleTables.scss';
</style>
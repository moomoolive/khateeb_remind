<template>
    <div 
        v-if="currentSchedule"
        :class="`gradient${background}`"
    >
        <header-renderer
            :table="type"
            :display="displayedMonthInfo"
            :week="displayData.weekOf"
            :lastUpdatedDateString="
                currentSchedule ? currentSchedule.savedOn : ' '
            "
            @change="displayControls($event)"
        />
        <control-renderer
            :table="type"
            :fridayDates="fridayDates"
            :display="displayedMonthInfo"
            :currentSchedule="currentSchedule"
            @change="displayControls($event)"
        />
        <table-renderer
            class="genSpace"
            :shownLocations="shownLocations"
            :table="type"
            :schedule="currentSchedule"
            :displayedWeek="displayData.weekOf"
            :originalSchedule="originalSchedule"
            @no-khateebs="initalized = false"
        />
    </div>
</template>

<script>
import datetime from '@/utils/dateTime/main.js'

import renderers from './rendering/index.js'

export default {
    name: 'scheduleRenderer',
    components: {
        'tableRenderer': renderers.tableRenderer,
        'headerRenderer': renderers.headerRenderer,
        'controlRenderer': renderers.controlRenderer
    },
    props: {
        type: {
            type: String,
            required: true
        },
        currentSchedule: {
            type: Object,
            required: false
        },
        originalSchedule: {
            type: Object,
            required: false
        },
        background: {
            type: String,
            required: false,
            default: 'blue'
        }
    },
    data() {
        return {
            originalMonth: 0,
            displayData: {
                location: 'All',
                weekOf: this.$store.state.date.upcomingFriday.date,
            },
            month: datetime.upcomingFriday(true)
        }
    },
    methods: {
        displayControls(event) {
            const changes = Object.keys(event)
            changes.forEach(elem => {
                const val = event[elem]
                if (elem === 'month') this.changeSchedule(val)
                else this.displayData[elem] = val 
            })
        },
        changeSchedule(value) {
            this.incrementMonth(value)
            this.requestUpdatedSchedule()
            this.$nextTick(() => { this.displayData.weekOf = this.fridayDates[0] })
        },
        incrementMonth(value) {
            value === 'up' ? value = 1 : value = -1
            const currentMonth = this.month.getMonth()
            const halfOfAMonth = 15
            while (this.month.getMonth() === currentMonth) {
                this.month = new Date(this.month.setDate(this.month.getDate() + (halfOfAMonth * value)))
            }
            this.originalMonth += value
        },
        requestUpdatedSchedule() {
            const info = {
                month: this.currentScheduleKey,
                    fridays: this.fridayDates,
                    monthsFromCurrent: this.originalMonth
            }
            this.$emit('schedule-change', info)
        }
    },
    computed: {
        currentScheduleKey() {
            return `${this.displayedMonthInfo.month}${this.displayedMonthInfo.year}`
        },
        shownLocations() {
            const location = this.displayData.location
            if (location !== 'All') {
                let returnLocation = {}
                returnLocation[location] = this.currentSchedule.data.rows[location] 
                return  returnLocation
            } else return this.currentSchedule.data.rows
        },
        displayedMonthInfo() {
            const firstFridayOfMonth = this.fridays[0]
            return {
                month: firstFridayOfMonth.toLocaleString('default', { month: 'long' }),
                year: firstFridayOfMonth.getFullYear(),
                abbreviatedMonthName: firstFridayOfMonth.toLocaleString('default', { month: 'short' })
            }
        },
        fridays() {
            const copy = new Date(this.month.getTime())
            return datetime.allUpcomingFridays(copy)
        },
        fridayDates() {
            return this.fridays.map(friday => friday.getDate())
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/scheduleControls.scss';
@import '~@/scss/miscStyles/gradientBackgrounds.scss';

$blue: 'blue';
@include gradient1($blue, $name: $blue);

$yellow: 'yellow';
@include gradient1($yellow, $name: $yellow);

.genSpace {
    margin-top: 5vh;
}
</style>
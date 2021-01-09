<template>
    <div 
        v-if="currentSchedule"
        :class="`gradient${background}`"
    >
        <slot 
            name="header" 
            :display="displayedMonthInfo"
            :week="displayData.weekOf"
            :lastUpdated="currentSchedule.savedOn"
            :change="displayControls"
        ></slot>
        <div class="controls display">
            <slot
                name="controls"
                :fridayDates="fridayDates"
                :display="displayedMonthInfo"
                :currentSchedule="currentSchedule"
                :change="displayControls"
            ></slot>
        </div>
        <table-and-cells
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

import tableAndCells from './renderedComponents/tableAndCells.vue'

export default {
    name: 'scheduleRenderer',
    components: {
        tableAndCells
    },
    props: {
        type: {
            type: String,
            required: true
        },
        currentSchedule: {
            type: Object,
            required: true
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
                weekOf: datetime.upcomingFriday(true).toUTCString(),
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
                monthsFromCurrent: this.originalMonth
            }
            this.$emit('schedule-change', info)
        },
        getScheduleWeeklyKeys(currentSchedule) {
            const keys = []
            for (const [key, value] of Object.entries(currentSchedule.data[0].monthlySchedule)) {
                keys.push(new Date(key))
            }
            return keys
        }
    },
    computed: {
        currentScheduleKey() {
            return `${this.month.toLocaleString('default', { month: 'long' })}-${this.month.getFullYear()}`
        },
        shownLocations() {
            const location = this.displayData.location
            if (location !== 'All') {
                let returnLocation = {}
                returnLocation[location] = this.currentSchedule.data[location] 
                return  returnLocation
            } else return this.currentSchedule.data
        },
        displayedMonthInfo() {
            const firstFridayOfMonth = this.fridays[0]
            console.log(firstFridayOfMonth)
            return {
                month: firstFridayOfMonth.toLocaleString('default', { month: 'long' }),
                year: firstFridayOfMonth.getFullYear(),
                abbreviatedMonthName: firstFridayOfMonth.toLocaleString('default', { month: 'short' })
            }
        },
        fridays() {
            return this.getScheduleWeeklyKeys(this.currentSchedule)
        },
        fridayDates() {
            return Object.keys(this.currentSchedule.data[0].monthlySchedule)
        }
    },
    watch: {
        fridayDates(newVal) {
            this.displayData.weekOf = newVal[0]
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
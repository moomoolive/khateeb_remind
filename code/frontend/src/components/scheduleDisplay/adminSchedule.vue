<template>
    <div style="padding-top: 20px;">
        <h2>Set Schedule</h2>
        <h2 v-if="!initalized">
            {{ errorMsg }}
        </h2>
        <div v-if="initalized">
            <change-week-buttons
            :fridayDates="fridayDates"
            :displayedMonthInfo="displayedMonthInfo"
            @change="displayData.weekOf = $event"
            class="whiteSpace"
            />
            <change-location-buttons
            :currentSchedule="currentSchedule"
            @change="displayData.location = $event"
            />
            <month-incrementer
            :display="displayedMonthInfo"
            :week="displayData.weekOf"
            @hit="$event === 'up' ? incrementMonth(1) : incrementMonth(-1);"
            />
            <table-renderer
            :shownLocations="shownLocations"
            table="admin"
            :schedule="currentSchedule"
            :displayedWeek="displayData.weekOf"
            :originalSchedule="originalSchedule"
            @no-khateebs="initalized = false"
            />
            <cool-btn
                style="margin-top: 20px;"
                @pushed="saveData()"
                color='grey'
                buttonText="Save Changes"
                :isDisabled="noSave"
            />
        </div>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'
import monthIncrementer from './admin/monthIncrementer.vue'
import schedule from '../../mixins/schedule.js'

export default {
    name: 'scheduleSetter',
    mixins: [schedule],
    components: {
        monthIncrementer
    },
    data() {
        return {
            originalMonth: 0
        }
    },
    methods: {
        incrementMonth(value) {
            const currentMonth = this.month.getMonth()
            const halfOfAMonth = 15
            while (this.month.getMonth() === currentMonth) {
                this.month = new Date(this.month.setDate(this.month.getDate() + (halfOfAMonth * value)))
            }
            this.$nextTick(async () => {
                this.fetchMonthlySchedule()
                this.displayData.weekOf = this.fridayDates[0]
                this.originalMonth += value
            })
        },
        updateSchedule(schedule) {
            this.currentSchedule = schedule
            this.cacheOriginalSchedule()
        },
        saveData() {
            const toBeDecidedIndicator = 'TBD'
            if (window.confirm("Are you sure you want to save these changes?")) {
                this.currentSchedule.month = this.originalSchedule.month = this.currentScheduleKey
                const payload = this._.deepCopy(this.currentSchedule)
                payload.original = this._.deepCopy(this.originalSchedule)
                this.$API.sendUpdatedSchedule(payload)
                this.cacheOriginalSchedule()
            }
        },
        async fetchMonthlySchedule() {
            const scheduleFor = `${this.currentScheduleKey}`
            const fridayDates = this.fridayDates
            const data = await this.$API.fetchMonthlySchedules(scheduleFor, fridayDates)
            if (data === 'No locations or timings were found!') this.errorMsg = data
            else {
                this.updateSchedule(data)
                this.initalized = true
            }
        }
    },
    computed: {
        currentScheduleKey() {
            return `${this.displayedMonthInfo.month}${this.displayedMonthInfo.year}`
        },
        isSame() {
            return equal(this.currentSchedule.data.rows, this.originalSchedule.data.rows)
        },
        isPreviousMonth() {
            return this.originalMonth < 0
        },
        noSave() {
            return this.isPreviousMonth || this.isSame
        }
    },
    created() {
        this.fetchMonthlySchedule()
    }
}
</script>

<style lang="scss" scoped>
.whiteSpace {
    $size: 30px;
    height: $size;
    margin-bottom: $size;
}
</style>
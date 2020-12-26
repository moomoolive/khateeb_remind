<template>
    <div>
        <h2 v-if="!initalized">
            {{ errorMsg }}
        </h2>
        <div v-if="initalized">
            <month-incrementer
                :display="displayedMonthInfo"
                :week="displayData.weekOf"
                @hit="$event === 'up' ? incrementMonth(1) : incrementMonth(-1);"
            />
            <div class="controls">
                <change-week-buttons
                    :fridayDates="fridayDates"
                    :displayedMonthInfo="displayedMonthInfo"
                    @change="displayData.weekOf = $event"
                    class="controlSplit"
                />
                <change-location-buttons
                    :currentSchedule="currentSchedule"
                    @change="displayData.location = $event"
                />
            </div>
            <div class="genSpace">
                <table-renderer
                    :shownLocations="shownLocations"
                    table="admin"
                    :schedule="currentSchedule"
                    :displayedWeek="displayData.weekOf"
                    :originalSchedule="originalSchedule"
                    @no-khateebs="initalized = false"
                />
                <button
                    @click="saveData()"
                    class='grey'
                    :disabled="noSave"
                >
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'
import monthIncrementer from './admin/monthIncrementer.vue'
import schedule from '@/mixins/schedule.js'

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
        async saveData() {
            if (window.confirm("Are you sure you want to save these changes?")) {
                this.currentSchedule.month = this.originalSchedule.month = this.currentScheduleKey
                const payload = this._.deepCopy(this.currentSchedule)
                payload.original = this._.deepCopy(this.originalSchedule)
                const response = await this.$API.admin.updatedSchedule(payload)
                if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
                    this.cacheOriginalSchedule()
                }
            }
        },
        async fetchMonthlySchedule() {
            const scheduleFor = `${this.currentScheduleKey}`
            const fridayDates = this.fridayDates
            const data = await this.$API.admin.getMonthlySchedule(scheduleFor, fridayDates)
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
@import '~@/scss/components/scheduleControls.scss';

.genSpace {
    margin-top: 3vh;
}

button {
    margin-top: 0;
}
</style>
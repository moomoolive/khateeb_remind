<template>
    <div>
        <div v-if="currentSchedule">
            <div>
                <h3 class="dateHeader">
                        {{ displayedMonthInfo.month }} {{ displayData.weekOf }}, {{displayedMonthInfo.year}}
                </h3>
                <h4 class="lastUpdated">{{ lastUpdated }}</h4>
            </div>
            <div class="controls">
                <slider-button
                leftMessage="This Week"
                rightMessage="This Month"
                altText="Toggle between weekly and monthly view"
                @slider-toggled="isWeeklyView = !isWeeklyView"
                class="controlSplit"
                />
                <change-week-buttons
                :fridayDates="fridayDates"
                :displayedMonthInfo="displayedMonthInfo"
                @change="displayData.weekOf = $event"
                v-if="!isWeeklyView"
                class="controlSplit"
                />
                <change-location-buttons
                :currentSchedule="currentSchedule"
                @change="displayData.location = $event"
                v-if="currentSchedule.data.rows.length > 1"
                />
            </div>
            <div class="display">
                <table-renderer
                :shownLocations="shownLocations"
                table="user"
                :schedule="currentSchedule"
                :displayedWeek="displayData.weekOf"
                :originalSchedule="originalSchedule"
                />
            </div>
        </div>
    </div>
</template>

<script>
import schedule from '@/mixins/schedule.js'

export default {
    name: 'khateebScheduleDisplay',
    mixins: [schedule],
    data() {
        return {
            isWeeklyView: true
        }
    },
    methods: {
        async getSchedule() {
            const monthlySchedule = await this.$API.monthlySchedule()
            if (
                monthlySchedule === `This month's schedule hasn't been created yet` ||
                !monthlySchedule
                ) {
                this.$emit('schedule', false)
            } else {
                this.$emit('schedule', true)
                this.currentSchedule = monthlySchedule
            }
        }
    },
    computed: {
        lastUpdated() {
            if (this.currentSchedule) {
                const lastUpdateDate = this.currentSchedule.savedOn
                const date = new Date(lastUpdateDate)
                const month = date.toLocaleString('default', {month: 'long'})
                const day = date.getDate()
                const year = date.getFullYear()
                return `Last Updated: ${month} ${day}, ${year}`
            }
        }
    },
    watch: {
        isWeeklyView(newValue) {
            if (newValue) {
                this.displayData.weekOf = this.$store.state.date.upcomingFriday.date
            }
        }
    },
    created() {
        this.getSchedule()
    }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/components/scheduleControls.scss";
.display {
    margin-top: 6vh;
}

.lastUpdated {
    color: darken(getColor("yellow"), 7%);
    margin-top: 0;
    font-size: 2.5vh;
    margin-bottom: 6vh;
}

.dateHeader {
    margin-bottom: 1vh;
    font-size: 4vh;
}
</style>
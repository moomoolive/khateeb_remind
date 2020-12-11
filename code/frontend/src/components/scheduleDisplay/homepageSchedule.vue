<template>
    <div>
        <div v-if="!initalized">
           {{ errorMsg }}
        </div>
        <div v-if="initalized">
            <slider-button
            leftMessage="This Week"
            rightMessage="This Month"
            altText="Toggle between weekly and monthly view"
            @slider-toggled="isWeeklyView = !isWeeklyView"
            style="margin-top: 20px; margin-bottom: 20px;"
            />
            <change-week-buttons
            :fridayDates="fridayDates"
            :displayedMonthInfo="displayedMonthInfo"
            @change="displayData.weekOf = $event"
            class="whiteSpace"
            />
            <change-location-buttons
            :currentSchedule="currentSchedule"
            @change="displayData.location = $event"
            class="whiteSpace"
            />
            <div id="headers">
                <h3 style="margin-top: 0px; margin-bottom: 4px;">
                    {{ displayedMonthInfo.month }} {{ displayData.weekOf }}, {{displayedMonthInfo.year}}
                </h3>
            </div>
            {{ lastUpdated }}
            <table-renderer
            :shownLocations="shownLocations"
            table="user"
            :schedule="currentSchedule"
            :displayedWeek="displayData.weekOf"
            :originalSchedule="originalSchedule"
            />
        </div>
    </div>
</template>

<script>
import schedule from '../../mixins/schedule.js'

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
            if (monthlySchedule === `This month's schedule hasn't been created yet`) {
                this.errorMsg = monthlySchedule
            } else {
                this.initalized = true
                this.currentSchedule = monthlySchedule
            }
        }
    },
    computed: {
        lastUpdated() {
            const lastUpdateDate = this.currentSchedule.savedOn
            const date = new Date(lastUpdateDate)
            const month = date.toLocaleString('default', {month: 'long'})
            const day = date.getDate()
            const year = date.getFullYear()
            return `Last Updated: ${month} ${day}, ${year}`
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
.whiteSpace {
    $size: 30px;
    height: $size;
    margin-bottom: $size;
}
</style>
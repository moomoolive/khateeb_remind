<template>
    <div>
        <div v-if="!initalized">
           {{ errorMsg }}
        </div>
        <div v-if="initalized">
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
            console.log(monthlySchedule)
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
$boxSize: 92%;
.display {
    margin-top: 6vh;
}

.controls {
    margin-top: 5vh;
    border: solid 1px getColor("blue");
    border-radius: 4px;
    width: $boxSize;
    margin-left: auto;
    margin-right: auto;
    background: linear-gradient(
        to left,
        getColor("red"),
        getColor("yellow")
    )
}

.controlSplit {
    $padding: 1vh;
    border-bottom: 
        getColor("grey") 
        solid 
        0.4vh;
    width: 90%;
    margin: 0 auto 0 auto;
    padding: $padding 0 $padding 0;
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
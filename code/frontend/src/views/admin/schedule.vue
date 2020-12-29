<template>
    <div>
        <schedule-renderer 
            type="admin"
            :currentSchedule="currentSchedule"
            :originalSchedule="originalSchedule"
            background="yellow"
            @schedule-change="setAPIRequestParams($event)"
        />
        <button
            @click="save()"
            class='grey'
            :disabled="notReadyToSubmit"
        >
            Save Changes
        </button>
    </div>
</template>

<script>
import scheduleRenderer from '@/components/appBuildingBlocks/schedules/scheduleRenderer.vue'
import datetime from '@/utils/dateTime/main.js'

import equal from 'fast-deep-equal'

export default {
    name: 'adminSchedule',
    components: {
        scheduleRenderer
    },
    data() {
        return {
            scheduleFor: null,
            fridayDates: null,
            currentSchedule: null,
            originalSchedule: null,
            monthsFromCurrent: 0
        }
    },
    methods: {
        async fetchMonthlySchedule(scheduleFor, fridayDates) {
            const data = await this.$API.admin.getMonthlySchedule(
                scheduleFor,
                fridayDates
            )
            if (!data) {
                console.log('hi')
            } 
            else if (data === 'No locations or timings were found!') {
                console.log('oh no')
            } else this.updateSchedule(data)
        },
        updateSchedule(schedule) {
            this.currentSchedule = schedule
            this.originalSchedule = this._.deepCopy(this.currentSchedule)
        },
        setAPIRequestParams($event) {
            this.scheduleFor = $event.month
            this.fridayDates = $event.fridays
            this.monthsFromCurrent = $event.monthsFromCurrent
        },
        initialAPIRequestParams() {
            const upcomingFriday = datetime.upcomingFriday(true)
            const month = upcomingFriday.toLocaleString('default', { month: 'long' })
            const allFridays = datetime.allUpcomingFridays(upcomingFriday)
            return {
                string: `${month}${upcomingFriday.getFullYear()}`,
                array: allFridays.map(friday => friday.getDate())
            }
        },
        prepSaveData() {
            this.currentSchedule.month = this.originalSchedule.month = this.scheduleFor
            const payload = this._.deepCopy(this.currentSchedule)
            payload.original = this._.deepCopy(this.originalSchedule)
            return payload
        },
        async save() {
            const msg = "Are you sure you want to save these changes?"
            if (window.confirm(msg)) {
                const payload = this.prepSaveData()
                const response = await this.$API.admin.updatedSchedule(payload)
                if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
                }
            }
        }
    },
    watch: {
        scheduleFor(newVal) {
            this.fetchMonthlySchedule(this.scheduleFor, this.fridayDates)    
        }
    },
    computed: {
        isSame() {
            if (this.currentSchedule) return equal(this.currentSchedule.data.rows, this.originalSchedule.data.rows)
            else return true
        },
        isPreviousMonth() {
            return this.monthsFromCurrent < 0
        },
        notReadyToSubmit() {
            return this.isPreviousMonth || this.isSame
        }
    },
    async created() {
        const data = this.initialAPIRequestParams()
        this.scheduleFor = data.string
        this.fetchMonthlySchedule(data.string, data.array)
    }
}
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <admin-schedule
            :currentSchedule="currentSchedule"
            :originalSchedule="originalSchedule"
            @schedule-change="setAPIRequestParams($event)"
        />
        <msg-with-pic
            v-if="error"
            :msg="`You need to setup locations and timing first`"
            :gif="`personThrowingPlane`"
        />
        <button
            v-if="currentSchedule && originalSchedule"
            class='grey'
            :disabled="notReadyToSubmit"
            @click="save()"
        >
            Save Changes
        </button>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

import adminSchedule from '@/components/schedules/templates/admin.vue'

import datetime from '@/utils/dateTime/main.js'

export default {
    name: 'scheduleSetter',
    components: {
        adminSchedule
    },
    data() {
        return {
            scheduleFor: null,
            currentSchedule: null,
            originalSchedule: null,
            monthsFromCurrent: 0,
            error: false
        }
    },
    methods: {
        async fetchMonthlySchedule(scheduleFor) {
            const data = await this.$API.admin.getMonthlySchedule(
                scheduleFor
            )
            if (!data) {
                console.log('hi')
            } 
            else if (data === 'No locations or timings were found!') {
                this.error = true
            } else this.updateSchedule(data)
        },
        updateSchedule(schedule) {
            this.currentSchedule = schedule
            this.originalSchedule = this._.deepCopy(this.currentSchedule)
        },
        setAPIRequestParams($event) {
            this.scheduleFor = $event.month
            this.monthsFromCurrent = $event.monthsFromCurrent
        },
        initialAPIRequestParams() {
            const upcomingFriday = datetime.upcomingFriday(true)
            const month = upcomingFriday.toLocaleString('default', { month: 'long' })
            const allFridays = datetime.allUpcomingFridays(upcomingFriday)
            return `${month}-${upcomingFriday.getFullYear()}`
        },
        prepSaveData() {
            //this.currentSchedule.month = this.originalSchedule.month = this.scheduleFor
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
            this.fetchMonthlySchedule(this.scheduleFor)    
        }
    },
    computed: {
        isSame() {
            if (this.currentSchedule) return equal(this.currentSchedule.data, this.originalSchedule.data)
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
        const scheduleFor = this.initialAPIRequestParams()
        this.fetchMonthlySchedule(scheduleFor)
    }
}
</script>

<style lang="scss" scoped>

</style>
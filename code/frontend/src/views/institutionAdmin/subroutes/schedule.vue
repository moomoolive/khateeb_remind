<template>
    <div>
        <khateeb-schedule
            @schedule-date="getSchedule($event)"
            :data="APIData"
            :revertToPreviousMonth="revertToPreviousMonth"
        >   
            <template #default="props">
                <change-month-buttons
                    :originalDate="props.originalDate"
                    :date="props.date"
                    @changed="props.changeViewingMonth($event)"
                />
            </template>
        </khateeb-schedule>
    </div>
</template>

<script>
import khateebSchedule from '@/components/schedules/khateebSchedule.vue'
import changeMonthButtons from '@/components/schedules/extraControls/changeMonth.vue'

export default {
    name: "scheduleSetter",
    components: {
        khateebSchedule,
        changeMonthButtons
    },
    data() {
        return {
            date: null,
            APIData: {
                isThisADummyValue: true
            },
            revertToPreviousMonth: false
        }
    },
    methods: {
        async getSchedule(date) {
            try {
                const month = date.getMonth()
                const year = date.getFullYear()
                const res = await this.$API.institutionAdmin.getSchedule(month, year)
                if (typeof res !== 'string' && res)
                    this.APIData = res
                else if (res === 'nobuild-previous')
                    this.revertToPrevious(`Previous Month schedule doesn't exist!`)
                else if (res === 'nobuild-future')
                    this.revertToPrevious(`You can't schedule more than one month ahead!`)
            } catch(err) {
                console.log(err)
            }
        },
        revertToPrevious(msg) {
            this.revertToPreviousMonth = true
            this._.alert(msg)
            this.$nextTick(() => { this.revertToPreviousMonth = false })
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>
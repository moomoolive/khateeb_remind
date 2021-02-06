<template>
    <div>
        <khateeb-schedule
            :data="APIData"
            :reciever="`institutionAdmin`"
            :emitCopy="true"
            :revertToPreviousMonth="revertToPreviousMonth"
            @copy="saveSchedule($event)"
            @schedule-date="getSchedule($event)"
            @override="saveSchedule($event)"
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
                    this.revertToPrevious(`Previous month schedule doesn't exist!`)
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
        },
        async saveSchedule($event) {
            try {
                const res = await this.$API.institutionAdmin.saveJummahs({ jummahs: $event })
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>
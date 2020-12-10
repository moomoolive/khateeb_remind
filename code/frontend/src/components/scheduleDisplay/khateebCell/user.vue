<template>
    <div>
        {{ display }}
    </div>
</template>

<script>
import schedule from '../../../mixins/schedule.js'

export default {
    name: 'adminKhateebDisplay',
    props: {
        schedule: {
            type: Object,
            required: true
        },
        displayedWeek: {
            type: Number,
            required: true
        },
        prayerTiming: {
            type: Number,
            required: true
        },
        originalSchedule: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isMounted: false
        }
    },
    methods: {
        tbd() {
            let khateebData = this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
            let allNull = true
            for (let field in khateebData) {
                if (khateebData[field]) allNull = false
            }
            if (allNull) {
                khateebData.firstName = 'TBD'
                khateebData.lastName = ''
            }
        }
    },
    computed: {
        display() {
            if (this.isMounted) {
                const x = this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
                return `${x.firstName} ${x.lastName}`
            }
            else 'TBD' 
        }
    },
    created() {
        this.tbd()
    },
    mounted() {
        this.isMounted = true
    }
}
</script>

<style>

</style>
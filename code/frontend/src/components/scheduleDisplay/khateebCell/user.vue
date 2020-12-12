<template>
    <div>
        <div style="display: inline; vertical-align: sub;">
            {{ display }}
        </div>
        <tag-box v-if="isUpdated"/>
    </div>
</template>

<script>
export default {
    name: 'userKhateebDisplay',
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
            type: null,
            required: false
        }
    },
    data() {
        return {
            isMounted: false,
            isUpdated: null
        }
    },
    methods: {
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
        const x = this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
        if (x.savedOn) {
            this.isUpdated = x.savedOn > this.$store.state.lastVisit
        }
    },
    mounted() {
        this.$nextTick(() => { this.isMounted = true })
    }
}
</script>

<style>

</style>
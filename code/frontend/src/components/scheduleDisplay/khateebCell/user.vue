<template>
    <div>
        <div style="display: inline; vertical-align: sub;">
            {{ display }}
        </div>
        <div class="tag">
            <tag-box 
                info="new" 
                v-if="isUpdated"
                :isWiggling="true"
            />
        </div>
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
        let x = this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
        if (x.savedOn) {
            x = new Date(x.savedOn)
            const y = new Date(this.$store.state.lastVisit)
            this.isUpdated = x < y
        }
    },
    mounted() {
        this.$nextTick(() => { this.isMounted = true })
    }
}
</script>

<style lang="scss" scoped>
.tag {
    padding-bottom: 1vh !important;
}

</style>
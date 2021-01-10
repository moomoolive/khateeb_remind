<template>
    <div>
        <div style="display: inline; vertical-align: sub;">
            {{ display }}
        </div>
        <div class="tag">
            <tag-box 
                info="new" 
                v-if="updated"
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
            type: String,
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
            updated: false
        }
    },
    methods: {
        isUpdated(val) {
            if (!val.savedOn)
                return false
            const cellSaveDate = new Date(val.savedOn).getTime()
            const lastVisit = new Date(this.$store.state.lastVisit).getTime()
            return cellSaveDate > lastVisit
        }
    },
    computed: {
        khateeb() {
            return this.schedule.monthlySchedule[this.displayedWeek].khateebs[this.prayerTiming]
        },
        display() {
            if (this.khateeb) 
                return `${this.khateeb.firstName} ${this.khateeb.lastName}`
            else 
                return 'TBD' 
        }
    },
    watch: {
        khateeb(newVal) {
            this.updated = this.isUpdated(newVal)
        }
    },
    created() {
        this.updated = this.isUpdated(this.khateeb)
    }
}
</script>

<style lang="scss" scoped>
.tag {
    padding-bottom: 1vh !important;
}

</style>
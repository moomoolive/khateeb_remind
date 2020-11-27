<template>
    <div>
        <h2 v-if="!isWeekly">This Month's Khateeb Schedule</h2>
        <h2 v-if="isWeekly">This Week's Khateeb Schedule</h2>
        <h4>{{ date.month }} {{ date.day }}, {{date.year}}</h4>
        <h3>Location: {{ khateebInfo.location }}</h3>
        <div style="height: 15px; margin-bottom: 15px;">
            <div v-if="!isWeekly" style="">
                <button
                v-for="(value, key) in khateebInfo.weeks"
                :key="key"
                @click="date.day = key"
                :aria-label="`button to view ${date.month} ${key}`"
                >
                    {{ date.button }} {{ key }}
                </button>
            </div>
        </div>
        <table style="width: 100%;">
            <tr>
                <th v-for="data in khateebInfo.columnData" :key="data">{{data}}</th>
            </tr>
            <tr v-for="item in displayedRows" :key="item.timing">
                <th>{{ item.timing }}</th>
                <th>{{ item.khateeb }}</th>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'monthlyKhateebSchedule',
    props: {
        isWeekly: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            date: {
                month: this.$store.state.date.month,
                year: this.$store.state.date.year,
                button: this.$store.state.date.month.slice(0,3),
                day: 27, //hardcoded right now
                upComingFriday: 27
            },
            khateebInfo : {
                weeks: this.$store.state.khateebSchedule.weeks,
                columnData: ['Timing', 'Khateeb'], //should hard code?? not sure
                location: this.$store.state.khateebSchedule.location
            }
        }
    },
    computed: {
        displayedRows() {
            if (!this.isWeekly) {
                return this.khateebInfo.weeks[this.date.day]
            } else {
                return this.khateebInfo.weeks[this.date.upComingFriday]
            }
        }
    },
    watch: {
        isWeekly(newValue) {
            if (newValue) {
                this.date.day = this.date.upComingFriday
            }
        }
    }
}
</script>

<style scoped>

</style>
<template>
    <div style="padding-top: 20px;">
        set schedule
        <div v-for="{friday, weekCount} in fridays" :key="friday">
            <input type="text" v-model="weeks[weekCount]">
        </div>
        {{ month }}
        <div>
            <button @click="incrementMonth(1)">Add month</button>
            <button @click="incrementMonth(-1)">Less month</button>
        </div>
        {{ weeks }}
    </div>
</template>

<script>
import datetime from '../../utils/datetime.js'

export default {
    name: 'scheduleSetter',
    data() {
        return {
            upComingFriday:  this.$store.state.date.upcomingFriday,
            month: new Date(),
            weeks: {
            }
        }
    },
    methods: {
        incrementMonth(value) {
            if (this.month.getMonth() === 0) {
                const minimumNumberOfDaysInFeburary = 28
                this.month = new Date(this.month.setDate(this.month.getDate() + minimumNumberOfDaysInFeburary))
            } else {
                this.month = new Date(this.month.setMonth(this.month.getMonth() + value))
            }
        }
    },
    computed: {
        fridays() {
            return datetime.allUpcomingFridays(this.month)
        },
        x() {
            return this.month.getMonth()
        }
    }
}
</script>

<style>

</style>
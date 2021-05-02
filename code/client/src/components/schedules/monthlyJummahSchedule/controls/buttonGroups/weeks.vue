<template>
    <div>
        <button
            v-for="(date, dateIndex) of weeklyKeys" 
            :key="dateIndex" 
            :class="`red ${ weekSelected(date) ? 'active-controls' : ''}`"
            @click="changeViewingWeek(date)"
        >
            {{ mainButtonText(date) + buttonYear }}
        </button>
    </div>
</template>

<script>
import datetime from '@/libraries/dateTime/main.js'

export default {
    name: "jummahScheduleSwitchWeeksButtons",
    props: {
        selectedDate: {
            type: Date,
            required: true
        }
    },
    methods: {
        mainButtonText(date) {
            const target = new Date(date)
            const month = target.toLocaleString('en-US', { month: 'short' })
            return `${month} ${target.getDate()}`
        },
        weekSelected(date) {
            return new Date(date).getDate() === this.selectedDate.getDate()
        },
        changeViewingWeek(date) {
            this.$emit('change-week', date)
        }
    },
    computed: {
        weeklyKeys() {
            const date = new Date(this.selectedDate)
            return datetime.allUpcomingFridays(date, true)
        },
        buttonYear() {
            const currentWeek = datetime.findUpcomingFriday()
            if (this.selectedDate.getFullYear() === currentWeek.getFullYear())
                return ''
            else
                return " '" + this.selectedDate.toLocaleString('en-US', { year: '2-digit' })
        },
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/individualStyleSheets/_jummahSchedule.scss';

button {
    font-size: 17px;
}

@media screen and (max-width: $phoneWidth) {
    
    button {
        font-size: 15px;
    }
}
</style>
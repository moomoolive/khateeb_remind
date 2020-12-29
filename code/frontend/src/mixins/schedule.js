import datetime from '../utils/dateTime/main.js'
import common from '../components/scheduleDisplay/common/index.js'

export default {
    data() {
        return {
            displayData: {
                location: 'All',
                weekOf: this.$store.state.date.upcomingFriday.date,
            },
            currentSchedule: null,
            errorMsg: null,
            initalized: false,
            month: datetime.upcomingFriday(true),
            originalSchedule: null
        }
    },
    methods: {
        cacheOriginalSchedule() {
            this.originalSchedule = this._.deepCopy(this.currentSchedule)
        }
    },
    components: {
        ...common
    },
    computed: {
        shownLocations() {
            const location = this.displayData.location
            if (location !== 'All') {
                let returnLocation = {}
                returnLocation[location] = this.currentSchedule.data.rows[location] 
                return  returnLocation
            } else return this.currentSchedule.data.rows
        },
        displayedMonthInfo() {
            const firstFridayOfMonth = this.fridays[0]
            return {
                month: firstFridayOfMonth.toLocaleString('default', { month: 'long' }),
                year: firstFridayOfMonth.getFullYear(),
                abbreviatedMonthName: firstFridayOfMonth.toLocaleString('default', { month: 'short' })
            }
        },
        fridays() {
            const copy = new Date(this.month.getTime())
            return datetime.allUpcomingFridays(copy)
        },
        fridayDates() {
            return this.fridays.map(friday => friday.getDate())
        }
    }
}
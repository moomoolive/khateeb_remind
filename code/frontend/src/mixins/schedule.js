import datetime from '../utils/datetime.js'
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
            month: new Date(),
            originalSchedule: null
        }
    },
    methods: {
        cacheOriginalSchedule() {
            this.originalSchedule = JSON.parse(JSON.stringify(this.currentSchedule))
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
            const firstFridayOfMonth = this.fridays[0].split(' ')
            const returnValue = {
                month: firstFridayOfMonth[1],
                year: firstFridayOfMonth[2],
                abbreviatedMonthName: firstFridayOfMonth[1].slice(0,3)
            }
            return returnValue
        },
        fridays() {
            return datetime.allUpcomingFridays(this.month)
        },
        fridayDates() {
            let splitDates = []
            let entry
            for (entry of this.fridays) {
                const x = entry.split(' ')
                splitDates.push(x[0])
            }
            return splitDates
        }
    }
}
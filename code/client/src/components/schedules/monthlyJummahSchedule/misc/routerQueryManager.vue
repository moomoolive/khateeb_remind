<template>
    <div>
    </div>
</template>

<script>
import datetime from '@/libraries/dateTime/main.js'
import typecheckingHelpers from '@/libraries/typeChecking/main.js'

export default {
    name: 'monthlyScheduleQueryManager',
    props: {
        locations: {
            type: Array,
            required: true
        },
        selectedDateQueryKey: {
            type: String,
            required: false,
            default: 'date'
        },
        selectedLocationQueryKey: {
            type: String,
            required: false,
            default: 'location'
        }
    },
    methods: {
        locationExists(locationId) {
            return this.locations.find(location => location._id === locationId)
        },
        validLocationQuery(locationId) {
            return locationId && (locationId === 'all' || this.locationExists(locationId))
        },
        validDateQuery(dateQueryString) {
            const dateObjectQuery = new Date(dateQueryString)
            const friday = 5
            return dateQueryString && typecheckingHelpers.isValidDate(dateObjectQuery) && dateObjectQuery.getDay() === friday
        },
        setDateQuery(dateQueryString) {
            const friday = 5
            let date = new Date(dateQueryString)
            if (date.getDate() !== friday)
                date = new Date(datetime.findUpcomingFriday(date))
            return date
        },
        changeRouterQuery(key, value) {
            if (this.$route.query[key] === value)
                return
            const query = { ...this.$route.query }
            query[key] = value
            this.$router.replace({ query })
        },
        validRouterQueries(dateStringQuery, locationQuery) {
            return this.validDateQuery(dateStringQuery) && this.validLocationQuery(locationQuery)
        },
        createValidQueries(dateStringQuery) {
            const queries = {
                date: datetime.findUpcomingFriday(),
                location: 'all',
            }
            if (dateStringQuery && typecheckingHelpers.isValidDate(new Date(dateStringQuery)))
                queries.date = this.setDateQuery(dateStringQuery)
            return queries
            
        },
        setRouterQueries({ date: dateObjectQuery, location: locationQuery}) {
            this.changeRouterQuery(this.selectedLocationQueryKey, locationQuery)
            this.changeRouterQuery(
                this.selectedDateQueryKey,
                datetime.dateFormatYM(dateObjectQuery, true)
            )
        },
        runQueryLoop(dateStringQuery, locationQuery, monthChanged) {
            if (!this.validRouterQueries(dateStringQuery, locationQuery)) {
                const queries = this.createValidQueries(dateStringQuery)
                return this.setRouterQueries(queries)
            }
            this.$emit('changed', { date: new Date(dateStringQuery), location: locationQuery , monthChanged })
        },
        emitQueryChanges(monthChanged) {
            this.runQueryLoop(
                this.$route.query[this.selectedDateQueryKey], 
                this.$route.query[this.selectedLocationQueryKey],
                monthChanged
            )
        }
    },
    watch: {
        $route(newVal, oldVal) {
            const newDate = new Date(newVal.query[this.selectedDateQueryKey])
            const oldDate = new Date(oldVal.query[this.selectedDateQueryKey])
            const monthChanged = !datetime.sameMonthSameYear(newDate, oldDate)
            return this.emitQueryChanges(monthChanged)
        }
    },
    mounted() {
        this.$nextTick(() => { this.emitQueryChanges(true) })
    }
}
</script>

<style lang="scss" scoped>
</style>
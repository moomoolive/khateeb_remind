import locations from '@/libraries/requests/routes/locations.js'
import timings from '@/libraries/requests/routes/timings.js'
import khateebs from '@/libraries/requests/routes/khateebs.js'

const requests = {
    getScheduleComponents() {
        return Promise.all([
            locations.getLocations(),
            timings.getTimings(),
            khateebs.getKhateebs()
        ])
    },
    getActiveLocationsAndTimings() {
        const query = { active: true }
        return Promise.all([
            locations.getLocations(query),
            timings.getTimings(query)
        ])
    },
    getAllLocationsAndTimings() {
        return Promise.all([
            locations.getLocations(),
            timings.getTimings()
        ])
    }
}

export default requests
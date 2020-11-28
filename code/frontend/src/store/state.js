export default {
    khateebSchedule: {
        // template for every location >> if there's more than one
        // X in the name 'locationX' is replace with a number
        // starting from 1
        locationX: {
            info: {
                name: null,
                address: null
            },
            monthlySchedule: {
                6: null,
                13: null,
                20: null,
                27: null
            }
        }
    },
    date: {
        currentDate: {
            month: null,
            year: null,
            date: null,
            dayOfTheWeek: null
        },
        upcomingFriday: {
            dayOfTheWeek: null,
            month: null,
            date: null,
            year: null,
            daysTill: null
        }
    }
}
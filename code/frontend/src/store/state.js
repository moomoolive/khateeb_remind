export default {
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
    },
    JWT_TOKEN: localStorage.getItem('token') || null,
    institution: 'uofc' //hardcoded
}
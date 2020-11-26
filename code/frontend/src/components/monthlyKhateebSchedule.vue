<template>
    <div>
        <h2>This Month's Khateeb Schedule</h2>
        <h4>{{ demo.date.month }} {{ demo.day }}th, {{demo.date.year}}</h4>
        <h3>Location: {{ demo.location }}</h3>
        <table style="width: 100%;">
            <tr>
                <th v-for="data in demo.columnData" :key="data">{{data}}</th>
            </tr>
            <tr v-for="item in demo.weeks[demo.day]" :key="item.timing">
                <th>{{ item.timing }}</th>
                <th>{{ item.khateeb }}</th>
            </tr>
        </table>
        <div>
            <button
            v-for="(value, key) in demo.weeks"
            :key="key"
            @click="demo.day = key"
            >
                {{ demo.date.button }} {{ key }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'monthlyKhateebSchedule',
    data() {
        return {
            demo: {
                day: 27,
                columnData: ['Timing', 'Khateeb'],
                weeks:{
                    6: [
                        {timing: '12:00PM', khateeb: 'Mo bro'},
                        {timing: '12:35PM', khateeb: 'Awesome Abdu'},
                        {timing: '1:35PM', khateeb: 'Insane Ibrahim'},
                        {timing: '2:00PM', khateeb: 'Starry Shehab'}
                    ],
                    13: [
                        {timing: '12:00PM', khateeb: 'meemo'},
                        {timing: '12:35PM', khateeb: 'Accurate Ali'},
                        {timing: '1:35PM', khateeb: 'Big Bareera'},
                        {timing: '2:00PM', khateeb: 'Astonishing AR'}
                    ],
                    20: [
                        {timing: '12:00PM', khateeb: 'Mo bro'},
                        {timing: '12:35PM', khateeb: 'Big abdu'},
                        {timing: '1:35PM', khateeb: 'Big abdu'},
                        {timing: '2:00PM', khateeb: 'Big abdu'}
                    ],
                    27: [
                        {timing: '12:00PM', khateeb: 'Authentic Ahmed'},
                        {timing: '12:35PM', khateeb: 'Onerous Omar'},
                        {timing: '1:35PM', khateeb: 'Neutral Nouman'},
                        {timing: '2:00PM', khateeb: 'Slick Slieuman'}
                    ],
                },
                location: 'Vitruvian',
                date: {
                    month: null,
                    year: null,
                    button: null
                }
            },
            monthlist: [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July", 
                        "August",
                        "September",
                        "October",
                        "November", 
                        "December"
            ],
            isMounted: false
        }
    },
    created() {
        const x = new Date()
        this.demo.date.month = this.monthlist[x.getMonth()]
        this.demo.date.button = this.demo.date.month.slice(0,3)
        this.demo.date.year = x.getFullYear()
    }
}
</script>

<style scoped>

</style>
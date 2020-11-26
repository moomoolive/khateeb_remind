<template>
    <div>
        <h2>This Week's Khateeb Schedule</h2>
        <h4>{{ demo.date }}</h4>
        <h3>Location: {{ demo.location }}</h3>
        <table style="width: 100%;">
            <tr>
                <th v-for="data in demo.columnData" :key="data">{{data}}</th>
            </tr>
            <tr v-for="item in demo.restOfTable" :key="item.timing">
                <th>{{ item.timing }}</th>
                <th>{{ item.khateeb }}</th>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'weeklyKhateebSchedule',
    data() {
        return {
            demo: {
                columnData: ['Timing', 'Khateeb'],
                restOfTable: [
                    {timing: '12:00PM', khateeb: 'Mo bro'},
                    {timing: '12:35PM', khateeb: 'Big abdu'},
                    {timing: '1:35PM', khateeb: 'Big abdu'},
                    {timing: '2:00PM', khateeb: 'Big abdu'}
                ],
                location: 'Vitruvian',
                date: 'November 27th, 2020'
            }
        }
    }
}
</script>

<style scoped>

</style>
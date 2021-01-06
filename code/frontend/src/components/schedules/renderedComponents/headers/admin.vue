<template>
    <div>
       <h2>
            {{ display.month }} {{ displayedWeek }}, {{ display.year }}
        </h2>
        <button
            class="yellow"
            @click="$emit('change', { month: 'up' })"
        >
            Next Month
        </button>
        <button
            class="yellow"
            @click="$emit('change', { month: 'down' })"
        >
            Previous Month
        </button>
    </div>
</template>

<script>
export default {
    name: 'adminScheduleHeader',
    props: {
        display: {
            type: Object,
            required: true
        },
        week: {
            type: [Number, String],
            required: true
        }
    },
    computed: {
        displayedWeek() {
            return new Date(this.week).getDate()
        }
    }
}
</script>

<style>
.buttons {
    display: inline;
    margin: 3px;
}
</style>
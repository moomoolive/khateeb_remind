<template>
    <div>
        <h3 class="dateHeader">
                {{ display.month }} {{ week }}, {{display.year}}
        </h3>
        <h4 class="lastUpdated">{{ lastUpdated }}</h4>
    </div>
</template>

<script>
export default {
    name: 'userScheduleHeader',
    props: {
        lastUpdated: {
            type: String,
            required: true
        },
        display: {
            type: Object,
            required: true
        },
        week: {
            type: [Number, String],
            required: true
        }
    }    
}
</script>

<style lang="scss" scoped>
.lastUpdated {
    color: darken(getColor("yellow"), 7%);
    margin-top: 0;
    font-size: 2.5vh;
    margin-bottom: 6vh;
}

.dateHeader {
    margin-bottom: 1vh;
    font-size: 4vh;
}
</style>
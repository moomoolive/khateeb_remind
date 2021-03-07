<template>
    <div>
        <div class="info-header">
            Click on a date to mark it as unavailable<br><br>
            <span class="blue">Blue dot</span> indicates current date<br>
            <span class="red">Red dot</span> indicates unavailable date
        </div>
        <v-calendar
            class="calendar"
            :attributes="attributes"
            color="blue"
            :min-date="new Date()"
            :disabled-dates='[ { weekdays: [1, 2, 3, 4, 5, 7] }, ...unavailableDates ]'
            @dayclick="addToUnavailableDays($event)"
            is-dark
            is-range
        />
    </div>
</template>

<script>
export default {
    name: "khateebCalendar",
    props: {
        originalVal: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            dates: []
        }
    },
    methods: {
        addToUnavailableDays($event) {
            const friday = 5
            if ($event.date.getDay() !== friday)
                return
            const found = this.dates.findIndex(date => date.vCalendarId === $event.id)
            if (found >= 0)
                this.dates.splice(found, 1)
            else
                this.dates.push({ vCalendarId: $event.id, date: $event.date.toISOString() })
        }
    },
    computed: {
        unavailableDates() {
            return this.dates.map(date => new Date(date.date))
        },
        attributes() {
            return [
                {
                    key: 'today',
                    dot: true,
                    dates: new Date()
                },
                {
                    key: "unavailable",
                    dot: 'red',
                    dates: this.unavailableDates
                }
            ]
        }
    },
    watch: {
        dates(newVal) {
            this.$emit('changed', { unavailableDates: newVal })
        }
    },
    created() {
        this.dates = this.utils.deepCopy(this.originalVal)
    }
}
</script>

<style lang="scss" scoped>
::v-deep div {
    height: auto !important;
    width: auto !important;
}

span {
    text-decoration: underline;
    &.red {
        color: getColor("red");
    }
    &.blue {
        color: getColor("blue");
    }
}

.info-header {
    font-size: 16px;
    color: getColor("offWhite");
    margin-bottom: 20px;
    margin-top: 20px;
    line-height: 20px;
}
</style>
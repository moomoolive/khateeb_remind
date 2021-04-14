<template>
    <div>

        <div class="settings-container">

            <collapsable-box
                class="user-setting"
                :headline="`Available Timings`"
                :tagDetails="availableTimingsTag"
            >
                <selection-picker
                    :options="availableTimingsSelection"
                    :currentlySelected="userInfo.availableTimings"
                    @changed="updateInfo({ availableTimings: $event })"
                />
            </collapsable-box>

            <collapsable-box
                class="user-setting"
                :headline="`Unavailable Dates`"
            >
                
                <div class="unavailable-date-info-header">
                    Click on a date to mark it as unavailable<br><br>
                    <span class="blue">Blue dot</span> indicates current date<br>
                    <span class="red">Red dot</span> indicates unavailable date
                </div>

                <v-calendar
                    class="calendar"
                    color="blue"
                    :disabled-unavailableDates='[ { weekdays: [1, 2, 3, 4, 5, 7] }, ...unavailableDates ]'
                    @dayclick="addToUnavailableDays($event)"
                    :min-date="new Date()"
                    :attributes="vCalendarAttributes"
                    is-dark
                    is-range
                />

            </collapsable-box>

        </div>

    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import selectionPicker from '@/components/general/selectionPicker.vue'

export default {
    name: "khateebAvailability",
    components: {
        collapsableBox,
        selectionPicker
    },
    data() {
        return {
            locations: [],
            timings: []
        }
    },
    methods: {
        async getAvailableTimings() {
            const [locations, timings] = await this.$API.chainedRequests.getActiveLocationsAndTimings()
            this.locations = locations
            this.timings = timings
        },
        addToUnavailableDays(newVCalendarDate={}) {
            const friday = 5
            const unavailableDates = this.utils.deepCopy(this.userInfo.unavailableDates)
            if (newVCalendarDate.date.getDay() !== friday)
                return
            const found = unavailableDates.findIndex(date => date.vCalendarId === newVCalendarDate.id)
            if (found >= 0)
                unavailableDates.splice(found, 1)
            else
                unavailableDates.push({ vCalendarId: newVCalendarDate.id, date: newVCalendarDate.date.toISOString() })
            this.updateInfo({ unavailableDates })
        },
        async updateInfo(update={}) {
            const res = await this.$API.user.updateInfo(update)
            if (!res.data)
                return this.utils.alert(`There was problem make your changes`)
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters['user/allInfo']
        },
        unavailableDates() {
            return this.userInfo.unavailableDates.map(d => new Date(d.date))
        },
        vCalendarAttributes() {
            return [
                { key: 'today', dot: true, dates: new Date() },
                { key: "unavailable", dot: 'red', dates: this.unavailableDates }
            ] 
        },
        availableTimingsSelection() {
            if (this.locations.length > 0 && this.timings.length > 0)
                return this.locations
                    .map(l => {
                        return this.timings
                            .filter(t => t.locationID === l._id)
                            .map(t => {
                                const time = new Date()
                                time.setHours(t.hour, t.minute, 0, 0)
                                return {
                                    display: [l.name, time.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })],
                                    val: t._id,
                                    extraInfo: `Address: ${l.address}`
                                }
                            })
                    })
                    .reduce((all, l) => [...all, ...l], [])
            else
                return []
        },
        availableTimingsTag() {
            if (this.userInfo.availableTimings.length < 1)
                return [{
                    words: 'Available for All',
                    symbol: '⌚',
                    color: 'goodNews'
                }]
            else
                return null
        },
    },
    created() {
        this.getAvailableTimings()
    }
}
</script>

<style lang="scss" scoped>
.user-setting {
    margin-bottom: 20px;
    width: 80%;
    max-width: 800px;
    @include centerMargin();
    max-height: 1500px;
}

.settings-container {
    margin-top: 15px;
}

.unavailable-date-info-header {
    font-size: 16px;
    color: getColor("offWhite");
    margin-bottom: 20px;
    margin-top: 20px;
    line-height: 20px;
}

@media screen and (max-width: $phoneWidth) {

    .unavailable-date-info-header {
        font-size: 14px;
    }

    .user-setting {
        margin-bottom: 15px;
    }
}
</style>
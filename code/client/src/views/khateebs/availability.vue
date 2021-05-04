<template>
    <div>
        <div class="settings-header">
            Availability Settings
        </div>

        <div class="settings-sub-header">
            <span class="dark-blue">
                {{ $store.state.user.institution.abbreviatedName }}
            </span>
        </div>
        
        <loading>

            <div class="settings-container">

                <collapsable-box
                    class="user-setting"
                    :headline="`Available Timings`"
                    :tagDetails="availableTimingsTag"
                >
                    <selection-picker
                        :options="availableTimingsSelection"
                        :currentlySelected="availableTimings"
                        @changed="updateScheduleRestrictions({ availableTimings: $event })"
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
        </loading>
    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import selectionPicker from '@/components/general/selectionPicker.vue'
import loading from '@/components/general/loadingScreen.vue'

import khateebHelpers from '@/libraries/khateebs/main.js'

export default {
    name: "khateebAvailability",
    components: {
        collapsableBox,
        selectionPicker,
        loading
    },
    data() {
        return {
            locations: [],
            timings: [],
            userInfo: {
                availableTimings: [],
                unavailableDates: []
            }
        }
    },
    methods: {
        async getAvailableTimings() {
            const [locations, timings] = await this._api.chainedRequests.getActiveLocationsAndTimings()
            this.locations = locations
            this.timings = timings
        },
        async getScheduleRestrictions() {
            const res = await this._api.user.getScheduleRestrictions()
            this.userInfo = res
        },
        addToUnavailableDays(newVCalendarDate={}) {
            const friday = 5
            const unavailableDates = this._utils.deepCopy(this.userInfo.unavailableDates)
            if (newVCalendarDate.date.getDay() !== friday) {
                return
            }
            const found = unavailableDates.findIndex(date => date.vCalendarId === newVCalendarDate.id)
            if (found >= 0) {
                unavailableDates.splice(found, 1)
            } else {
                unavailableDates.push({ vCalendarId: newVCalendarDate.id, date: newVCalendarDate.date.toISOString() })
            }
            this.updateScheduleRestrictions({ unavailableDates })
        },
        async updateScheduleRestrictions(update={}) {
            const res = await this._api.user.updateScheduleRestrictions(update)
            if (!res) {
                return this._utils.alert(`There was problem make your changes`)
            } else {
                this.userInfo = res
            }
        },
    },
    computed: {
        availableTimings() {
            return this.userInfo.availableTimings
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
        usersFullNameWithTitle() {
            return this._utils.stringFormat(khateebHelpers.khateebName(this.$store.state.user.userInfo))
        }
    },
    watch: {
        async unavailableDates(newVal, oldVal) {
            if (newVal.length === oldVal.length)
                return
            const longerArray = newVal.length > oldVal.length ? newVal : oldVal
            const diff = longerArray.slice(-1)[0]
            const wasDeleted = newVal.length < oldVal.length
            await this._api.khateebs.sendAvailabilityUpdateToAdmins("Date", {
                change: { diff, wasDeleted },
                msg: `${this.usersFullNameWithTitle} is ${wasDeleted ? 'now available' : 'no longer available'} to give khutbahs on ${new Date(diff).toLocaleDateString('en-US', { month: "long", year: "numeric", day: "numeric" })}${wasDeleted ? ` insha'Allah` : ''}.` 
            })
        },
        async availableTimings(newVal, oldVal) {
            if (oldVal.length === newVal.length)
                return
            const longerArray = newVal.length > oldVal.length ? newVal : oldVal
            const shorterArray = newVal.length > oldVal.length ? oldVal : newVal
            const diff = longerArray.filter(e => !shorterArray.find(el => el === e))[0]
            const lessAvailable = newVal.length === 0 ? 
                false : newVal.length === 1 ? 
                true : newVal.length < oldVal.length
            await this._api.khateebs.sendAvailabilityUpdateToAdmins("Timing", {
                change: { diff, lessAvailable },
                msg: `${this.usersFullNameWithTitle} ${lessAvailable ? `is less available nowadays to give` : `is now available to give more` } khutbahs${lessAvailable ? `.` : ` insha'Allah!`} Check out his profile for more details.` 
            })
        }
    },
    created() {
        this.getAvailableTimings()
        this.getScheduleRestrictions()
    }
}
</script>

<style lang="scss" scoped>
.user-setting {
    margin-bottom: 20px;
    width: 80%;
    max-width: 800px;
    @include center-margin();
    max-height: 1500px;
}

.settings-container {
    margin-top: 15px;
}

.unavailable-date-info-header {
    font-size: 16px;
    color: get-color("off-white");
    margin-bottom: 20px;
    margin-top: 20px;
    line-height: 20px;
}

.settings-header {
    font-size: 27px;
    margin-bottom: 7px;
}

.settings-sub-header {
    font-size: 20px;
    margin-bottom: 50px;
}

@media screen and (max-width: $phone-width) {

    .unavailable-date-info-header {
        font-size: 14px;
    }

    .user-setting {
        margin-bottom: 15px;
    }
}
</style>
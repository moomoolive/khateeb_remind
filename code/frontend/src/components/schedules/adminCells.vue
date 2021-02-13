<template>
    <div>
        <div v-if="data">
            <button
                v-if="viewingMonth !== 'past' && currentWeek && currentWeek !== 'past' && !data.confirmed" 
                class="yellow"
                @click="manualOverride()"
            >
                Manual Override
            </button>
            <div 
                v-for="(preference, preferenceNo) in data.khateebPreference"
                :key="preferenceNo"
            >
                <p>Preference {{ preferenceNo + 1 }}</p>
                <div v-if="readOnly(preference)">
                    <p>
                        <span 
                            v-if="preference.notified && preference.responded && preference.confirmed"
                        >
                            ⭐
                        </span>
                        {{ readOnlyKhateebDisplay(preference.khateebID) }} 
                    </p>
                </div>
                <select
                    v-else
                    v-model="preference.khateebID" 
                    @change="change($event.target.value, preferenceNo, preference._id)"
                >
                    <option value="TBD">TBD</option>
                    <option
                        v-for="(khateeb, khateebNo) in khateebs"
                        :key="khateebNo"
                        :value="khateeb._id"
                    >
                        {{ khateebDisplay(khateeb) }}
                    </option>
                </select>
                <div v-if="currentWeek === 'current'">
                    <div 
                        v-for="(notifiction, index) in currentWeekNotifications(preference)" 
                        :key="index"
                        class="current-week-notification"
                    >
                        {{ notifiction }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import datetime from '@/utils/dateTime/main.js'

export default {
    name: "adminKhateebCells",
    props: {
        timing: {
            type: Object,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        },
        weekOf: {
            type: String,
            required: true
        },
        viewingMonth: {
            type: String,
            required: true
        },
        currentWeek: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            data: null,
            cachedKhateebPreferences: []
        }
    },
    methods: {
        async change($event, number, id) {
            if ($event !== 'TBD') {
                const khateebFullInfo = this.khateebs.find(khateeb => khateeb._id === $event)
                const notAvailableForAllTimings = khateebFullInfo.availableTimings.length > 0
                if (notAvailableForAllTimings && !this.isAvailableTiming(khateebFullInfo)) {
                    const confirm = await this._.confirm(`This is timing is not one of ${khateebFullInfo.firstName} ${khateebFullInfo.lastName}'s available timings! Are you sure you want to schedule him for this jummah anyway?`)
                    if (!confirm) {
                        const originalKhateeb = this.cachedKhateebPreferences[number].khateebID
                        return this.data.khateebPreference[number].khateebID = originalKhateeb
                    } 
                }    
            }
            this.cachedKhateebPreferences[number].khateebID = $event
            const info = {
                val: $event,
                number,
                id
            }
            this.$emit('changed', info)
        },
        khateebDisplay(khateeb) {
            let base = `${khateeb.firstName} ${khateeb.lastName}`
            if (khateeb.title !== 'none')
                base = `${khateeb.title} ${base}`
            return base 
        },
        isAvailableTiming(khateebFullInfo) {
            let currentTimingIsOneOfAvailableTimings = false
            khateebFullInfo.availableTimings.forEach(timing => {
                if (timing === this.timing.timingID)
                    currentTimingIsOneOfAvailableTimings = true
            })
            return currentTimingIsOneOfAvailableTimings
        },
        readOnlyKhateebDisplay(khateebID) {
            const found = this.khateebs.find(khateeb => khateeb._id === khateebID)
            if (found)
                return this.khateebDisplay(found)
            else
                return khateebID
        },
        weekIsInPast() {
            if (this.viewingMonth === 'past')
                return true
            else if (this.viewingMonth === 'future')
                return false
            else 
                return datetime.upcomingFriday(true).getDate() > parseInt(this.weekOf)
        },
        readOnly(preference) {
            return this.weekIsInPast() || this.timing.confirmed || preference.notified
        },
        currentWeekNotifications(preference) {
            const notifications = []
            if (this.data.confirmed)
                return notifications
            if (preference.notified)
                notifications.push('📦 Notified')
            if (preference.notified && !preference.responded)
                notifications.push('📞 No Response')
            if (preference.notified && preference.responded && !preference.confirmed)
                notifications.push('❌ Canceled')
            return notifications
        },
        async manualOverride() {
            const confirm = await this._.confirm(`Manual Override will stop all notifications from reaching khateebs associated with this jummah, make this jummah uneditable, and set the first preference as scheduled khateeb. Are you sure you want to manually override?`)
            if (confirm)
                this.$emit('override')
        }
    },
    created() {
        this.data = this._.deepCopy(this.timing)
        this.cachedKhateebPreferences = this._.deepCopy(this.data.khateebPreference)
    }
}
</script>

<style lang="scss" scoped>
select {
    width: 80%;
    text-align: center;
    border: none;
    outline: none;
    height: 4vh;
    max-height: 40px;
    font-size: 15px;
    color: getColor("offWhite");
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
}

p { 
    text-align: left;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 17px;
}

.current-week-notification {
    font-size: 17px;
    text-align: left;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    font-weight: bold;
}

button {
    width: 80%;
    font-size: 15px;
    margin-bottom: 10px;
}

@media screen and (max-width: $phoneWidth) {
    select {
        font-size: 2vh;
    }
    p { 
        margin-top: 4vh;
        font-size: 2.5vh;
    }
    .current-week-notification {
        font-size: 2.7vh;
    }
    button {
        font-size: 2.2vh;
    }
}
</style>
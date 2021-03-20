<template>
    <div class="location-container">
            
        <div>
            <p class="location-label">{{ location.name }}</p>
            <p class="location-label address">{{ location.address }}</p>
        </div>
        
        <span v-if="jummahContentAvailable()">

            <jummah-display
                v-for="(timing, timingIndex) in timings.filter(timing => timing.locationID === location._id)"
                :key="timingIndex"
                class="jummah-container"
                :reciever="reciever"
                :khateebs="khateebs"
                :khateebPreferences="khateebPreferencesForTiming(timing._id)"
                :location="location"
                :timing="timing"
                :selectedDate="selectedDate"
                :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                @new-preference="$emit('new-preference', $event)"
                @update-preference="$emit('update-preference', $event)"
                @open-settings="$emit('open-settings', $event)"
            />

        </span> 

        <div v-else>
            <img src="~@/assets/misc/emptyCalendar.png" class="no-entries-picture" />
            <div class="no-entries-text">
                No Entries for this Week
            </div>
        </div>

    </div>
</template>

<script>
import jummahDisplay from '@/components/schedules/monthlyJummahSchedule/jummahDisplay/main.vue'

export default {
    name: 'monthlyScheduleLocationDisplayer',
    components: {
        jummahDisplay
    },
    props: {
        location: {
            type: Object,
            required: true
        },
        jummahs: {
            type: Array,
            required: true
        },
        reciever: {
            type: String,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        },
        viewingWeekIsCurrentPastOrFuture: {
            type: String,
            required: true
        },
        timings: {
            type: Array,
            required: true
        },
        selectedDate: {
            type: Date,
            required: true
        },
    },
    methods: {
        khateebPreferencesForTiming(timingId) {
            const preferences = this.jummahs.filter(j => j.timingID === timingId && j.locationID === this.location._id)
            const mainKhateeb = preferences.find(p => !p.isBackup) || {}
            const backupKhateeb = preferences.find(p => p.isBackup) || {}
            return [mainKhateeb, backupKhateeb]
        },
        jummahContentAvailable() {
            const preferencesAvailable = this.jummahs.filter(j => j.locationID === this.location._id).length > 0
            return preferencesAvailable || this.viewingWeekIsCurrentPastOrFuture !== 'past'
        }
    }
}
</script>

<style lang="scss" scoped>
.jummah-container {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
    height: 20%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    flex-direction: row;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    border-radius: 7px;
}

.location-label {
    font-size: 35px;
    font-weight: bold;
    text-decoration: underline dotted;
    &.address {
        font-size: 25px;
        text-decoration: none;
    }
}

.location-container {
    background: themeRGBA("green", 0.7);
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom: 60px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.no-entries-picture {
    width: 70%;
}

.no-entries-text {
    font-size: 18px;
}

@media screen and (max-width: $phoneWidth) {
   .location-container {
        margin-bottom: 20%;
    }
    .location-label {
        font-size: 3.6vh;
        &.address {
            font-size: 2.6vh;
        }
    }
    .jummah-container {
        display: flex;
        flex-direction: column;
    } 
}
</style>
<template>
    <div class="location-container">
            
        <div class="location-info ">
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
                :khateebPreferences="khateebPreferencesForTiming(timing._id, timing)"
                :location="location"
                :timing="timing"
                :selectedDate="selectedDate"
                :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                @new-preference="$emit('new-preference', $event)"
                @update-preference="$emit('update-preference', $event)"
                @open-settings="$emit('open-settings', $event)"
            />

        </span> 

        <general-message
            v-else
            :message="`No Entries for this Week`"
            :fontAwesomeIcon="['fas', 'calendar-alt']"
            iconColor="darkBlue"
        />

    </div>
</template>

<script>
import jummahDisplay from '@/components/schedules/monthlyJummahSchedule/jummahDisplay/main.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

import datetime from '@/libraries/dateTime/main.js'

export default {
    name: 'monthlyScheduleLocationDisplayer',
    components: {
        jummahDisplay,
        generalMessage
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
        fridayNumberOfSelectedMonth: {
            type: Number,
            required: true
        },
        completeKhateebsList: {
            type: Array,
            required: true
        }
    },
    methods: {
        khateebPreferencesForTiming(timingId="1234", timing={}) {
            const preferences = this.jummahs.filter(j => j.timingID === timingId && j.locationID === this.location._id)
            const mainKhateeb = preferences.find(p => !p.isBackup) || this.findDefaultKhateeb(timing, false) || {}
            const backupKhateeb = preferences.find(p => p.isBackup) || this.findDefaultKhateeb(timing, true) || {}
            return [mainKhateeb, backupKhateeb]
        },
        jummahContentAvailable() {
            const preferencesAvailable = this.jummahs.filter(j => j.locationID === this.location._id).length > 0
            return preferencesAvailable || this.viewingWeekIsCurrentPastOrFuture !== 'past'
        },
        findDefaultKhateeb(timing, backup=false) {
            const defaultsForTiming = timing.defaultKhateebs[this.fridayNumberOfSelectedMonth - 1]
            const targetVal = defaultsForTiming[backup ? 'backup' : "mainKhateeb"]
            if (targetVal === this._config.nullId || !targetVal)
                return null
            const targetKhateeb = this.completeKhateebsList.find(k => k._id === targetVal)
            const notAbleToGiveThisKhutbah = targetKhateeb.unavailableDates.find(({ date }) => datetime.sameDateMonthAndYear(date, this.selectedDate))
            if (notAbleToGiveThisKhutbah)
                return null
            const date = new Date(this.selectedDate)
            date.setUTCHours(12, 0, 0, 0)
            return {
                updatedAt: timing.updatedAt,
                createdAt: timing.createdAt,
                isGivingKhutbah: !backup,
                isBackup: backup,
                khateebID: targetVal,
                notified: false,
                upsert: true,
                date: date.toISOString(),
                timingID: timing._id,
                locationID: this.location._id,
                institutionID: this.$store.state.user.institution._id
            }
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

.location-info {
    margin-bottom: 40px;
}

.location-label {
    font-size: 35px;
    font-weight: bold;
    text-decoration: underline dotted;
    
    &.address {
        font-size: 25px;
        text-decoration: none;
        margin-top: 5px;
        color: getColor("offWhite");
    }
}

.location-container {
    background: themeRGBA("green", 0.7);
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 50px;
    padding-bottom: 50px;
    margin-bottom: 60px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.no-entries-picture {
    width: 70%;
}

.no-entries-text {
    font-size: 25px;
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
    
    .no-entries-text {
        font-size: 18px;
    }
}
</style>
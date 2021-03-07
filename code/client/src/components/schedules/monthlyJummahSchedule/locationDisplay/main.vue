<template>
    <div class="location-container">
        <div v-if="jummahs.length > 0">
            
            <div>
                <p class="location-label">{{ location.name }}</p>
                <p class="location-label address">{{ location.address }}</p>
            </div>
            
            <div v-if="jummahs.filter(jummah => jummah.locationID === location._id).length > 0">
                <span
                    v-for="(jummah, jummahIndex) in jummahs"
                    :key="jummahIndex"
                >   
                    <jummah-display
                        v-if="jummah.locationID === location._id"
                        class="jummah-container"
                        :jummah="jummah"
                        :filteredTimings="filteredTimings"
                        :reciever="reciever"
                        :khateebs="khateebs"
                        :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                        :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                        :selectedDate="selectedDate"
                        @jummah-update="$emit('jummah-update', $event)"
                        @jummah-update-delay="$emit('jummah-update-delay', $event)"
                        @open-settings="$emit('open-settings', { ...$event, location })"
                    />
                </span>
            </div>

            <div v-else>
                <img src="~@/assets/misc/emptyCalendar.png" class="no-entries-picture" />
                <div class="no-entries-text">
                    No Entries for this Week
                </div>
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
        viewingMonthIsCurrentPastOrFuture: {
            type: String,
            required: true
        },
        viewingWeekIsCurrentPastOrFuture: {
            type: String,
            required: true
        },
        selectedDate: {
            type: Date,
            required: true
        },
        filteredTimings: {
            type: Array,
            required: true
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
        font-size: 27px;
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
            font-size: 2.8vh;
        }
    }
    .jummah-container {
        display: flex;
        flex-direction: column;
    } 
}
</style>
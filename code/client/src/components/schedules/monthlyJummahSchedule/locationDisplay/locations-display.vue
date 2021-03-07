<template>
  <div class="locations-container">
      <div v-if="locations.length > 0">
          <location-display 
                v-for="(location, locationIndex) in locations"
                :key="locationIndex"
                :location="location"
                :jummahs="filteredJummahs"
                :filteredTimings="filteredTimings"
                :reciever="reciever"
                :khateebs="khateebs"
                :viewingWeekIsCurrentPastOrFuture="viewingWeekIsCurrentPastOrFuture"
                :viewingMonthIsCurrentPastOrFuture="viewingMonthIsCurrentPastOrFuture"
                :selectedDate="selectedDate"
                @jummah-update="$emit('jummah-update', $event)"
                @jummah-update-delay="$emit('jummah-update-delay', $event)"
                @open-settings="$emit('open-settings', $event)"
            />
      </div>
      <div v-else>
        <div v-if="viewingMonthIsCurrentPastOrFuture === 'past'">
            <div class="button-label no-jummahs">
                No jummahs were scheduled for this month
            </div>
            <div class="button-label icon">
                🚫
            </div>
        </div>

        <component
            v-else 
            :is="`${reciever}NoJummah`"
            :monthsFromCurrent="monthsFromCurrent"
            @build-schedule="$emit('build-schedule')"
        />
      </div>
  </div>
</template>

<script>
import locationDisplay from './main.vue'

export default {
    name: 'locationsDisplay',
    components: {
        locationDisplay,
        "khateebNoJummah": () => import('./noJummahDisplay/khateeb'),
        "institutionAdminNoJummah": () => import('./noJummahDisplay/admin.vue')
    },
    props: {
        locations: {
            type: Array,
            required: true
        },
        selectedLocation: {
            type: String,
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
        timings: {
            type: Array,
            required: true
        },
        monthsFromCurrent: {
            type: Number,
            required: true
        }
    },
    methods: {
        sortJummahByTime(jummahA, jummahB) {
            let jummahATiming = this.jummahTimingDateObject(jummahA).getTime()
            let jummahBTiming = this.jummahTimingDateObject(jummahB).getTime()
            if (jummahATiming > jummahBTiming)
                return -1
            else if (jummahATiming < jummahBTiming)
                return 1
            return 0
        },
        jummahTimingDateObject(jummah) {
            const timing = this.timings.find(timing => jummah.timingID === timing._id)
            const dateObject = new Date()
            dateObject.setHours(timing.hour)
            dateObject.setMinutes(timing.minute)
            return dateObject
        }
    },
    computed: {
        filteredTimings() {
            return this.timings
                .filter(timing => this.jummahs
                    .filter(jummah => jummah.timingID === timing._id).length > 0
                )
        },
        filteredJummahs() {
            return this.jummahs
                .filter(jummah => new Date(jummah.date).getDate() === this.selectedDate.getDate())
                .sort(this.sortJummahByTime)
        },
    }
}
</script>

<style lang="scss" scoped>
.locations-container {
    margin-top: 60px;
}

::v-deep .button-label {
    font-size: 17px;
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: bold;
    color: getColor("offWhite");
    &.no-jummahs {
        text-decoration: underline;
    }
    &.icon {
        font-size: 30px
    }
}

::v-deep .display-button {
    $size: 50px;
    height: $size;
    max-width: $size;
    font-size: 30px;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@media screen and (max-width: $phoneWidth) {
    .locations-container {
        margin-top: 8vh;
    }
}
</style>
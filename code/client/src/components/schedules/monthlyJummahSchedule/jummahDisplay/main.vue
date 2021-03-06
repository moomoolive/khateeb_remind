<template>
    <div v-if="showJummah">
        
        <!-- timing display -->
        <div class="timing-container">
            <div class="jummah-status-container">
                <tag-circle
                    class="jummah-tag"
                    :info="renderJummahTag(
                        viewingMonthIsCurrentPastOrFuture,
                        viewingWeekIsCurrentPastOrFuture,
                        jummah
                    )"
                />
            </div>
            <span class="timing-label">
                {{ jummahTiming(jummah) }}
            </span>
        </div>
        <!-- TIMING DISPLAY ENDS HERE -->

        <!-- schedule cell -->
        <div class="jummahPreferences">
            <component
                :is="reciever"
                :timing="jummah"
                :weekOf="selectedDate"
                :viewingMonth="viewingMonthIsCurrentPastOrFuture"
                :currentWeek="viewingWeekIsCurrentPastOrFuture"
                :khateebs="khateebs"
            />
            <!-- updated date -->
            <div class="last-updated">
                <span class="timing">Last Updated:</span><br>
                {{ _.dynamicDisplayDate(jummah.updatedAt) }}
            </div>
            <!-- ENDS HERE -->
        </div>
        <!-- SCHEDULE CELL END HERE -->

    </div>
</template>

<script>
import tagCircle from '@/components/general/tagCircle.vue'
import jummahStaticTags from './jummahTags.json'

export default {
    name: 'jummahDisplayer',
    components: {
        tagCircle,
        "institutionAdmin": () => import('./khateebInfoCells/adminCells.vue'),
        "khateeb": () => import("./khateebInfoCells/khateebCells.vue")
    },
    props: {
        jummah: {
            type: Object,
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
    },
    data() {
        return {
            showJummah: true,
            jummahStaticTags
        }
    },
    methods: {
        jummahTiming(jummah) {
            const timing = this.jummahTimingDateObject(jummah)
            return timing.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
        },
        findJummahTiming(jummah) {
            return this.filteredTimings.find(timing => jummah.timingID === timing._id)
        },
        jummahTimingDateObject(jummah) {
            const timing = this.findJummahTiming(jummah)
            const dateObject = new Date()
            dateObject.setHours(timing.hour)
            dateObject.setMinutes(timing.minute)
            return dateObject
        },
        renderJummahTag(viewingMonth, viewingWeek, jummah) {
            try {
                return this[viewingMonth + 'MonthJummahTag'](viewingWeek, jummah)
            } catch(err) {
                return jummahStaticTags.defaultTag
            }
        },
        currentMonthJummahTag(viewingWeek, jummah) {
            if (viewingWeek !== 'current')
                return this[viewingWeek + 'MonthJummahTag'](jummah)
            if (jummah.confirmed)
                return jummahStaticTags.currentWeekTags.confirmed
            else if (jummah.khateebPreference[0].notified)
                return jummahStaticTags.currentWeekTags.notified
            return jummahStaticTags.defaultTag
        },
        futureMonthJummahTag() {
            return jummahStaticTags.futureTags.general
        },
        pastMonthJummahTag(jummah) {
            if (jummah.confirmed)
                return jummahStaticTags.pastTags.complete
            else
                return jummahStaticTags.pastTags.missed
        },
    },
    watch: {
        selectedDate() {
            // rerender cell
            this.showJummah = false
            this.$nextTick(() => { this.showJummah = true })
        }
    }
}
</script>

<style lang="scss" scoped>
.timing-container {
    background: getColor("offWhite");
    height: auto !important;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.jummah-status-container {
    height: 40%;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.jummahPreferences {
    background: getColor("silver");
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.last-updated {
    font-size: 16px;
    margin-top: 10px;
    font-weight: bold;
    background: themeRGBA("red", 0.9);
    margin-left: auto;
    margin-right: auto;
    width: 87%;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

span {
    &.timing {
        font-size: 14px;
        text-decoration: underline;
        color: getColor("offWhite");
    }
}

.timing-container {
    background: getColor("offWhite");
    height: auto !important;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: $phoneWidth) {
    .timing-container {
        padding-top: 2vh;
        padding-bottom: 2vh;
        background: getColor("offWhite");
        height: auto !important;
        border-radius: 0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }

    .jummah-status-container {
        margin-bottom: 2vh;
        height: 5vh;
    }

    .jummahPreferences {
        border-radius: 0;
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        padding-top: 2vh;
        padding-bottom: 2vh;
        padding-top: 0;
    }
    .last-updated {
        font-size: 2.2vh;
    }
    .timing-container {
        padding-top: 2vh;
        padding-bottom: 2vh;
        background: getColor("offWhite");
        height: auto !important;
        border-radius: 0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }
}
</style>
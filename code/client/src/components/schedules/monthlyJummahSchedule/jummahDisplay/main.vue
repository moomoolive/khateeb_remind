<template>
    <div v-if="showJummah">
        
        <div class="timing-container">
            <div class="jummah-status-container">
                <tag-circle
                    class="jummah-tag"
                    :info="renderJummahTag(viewingWeekIsCurrentPastOrFuture)"
                />
            </div>
            <span class="timing-label">
                {{ jummahTiming() }}
            </span>
        </div>

        <div class="jummahPreferences">
            
            <div class="settings-icon-container">
                <div>
                    <button 
                        :disabled="viewingWeekIsCurrentPastOrFuture === 'past'" 
                        class="icon-button blue"
                        @click="$emit('open-settings', { khateebPreferences, timing, location })"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            <component
                :is="reciever"
                :currentWeek="viewingWeekIsCurrentPastOrFuture"
                :khateebs="khateebs"
                :khateebPreferences="khateebPreferences"
                :location="location"
                :timing="timing"
                :selectedDate="selectedDate"
                @new-preference="$emit('new-preference', $event)"
                @update-preference="$emit('update-preference', $event)"
            />

            <div v-if="preferenceEntryExists" class="last-updated">
                <div class="timing">Last Updated:</div>
                {{ updateDisplay() }}
            </div>

        </div>

    </div>
</template>

<script>
import tagCircle from '@/components/general/tagCircle.vue'
import jummahStaticTags from './jummahTags.json'

import timingHelpers from '@/libraries/timings/main.js'

export default {
    name: 'jummahDisplayer',
    components: {
        tagCircle,
        "institutionAdmin": () => import('./khateebInfoCells/adminCells.vue'),
        "khateeb": () => import("./khateebInfoCells/khateebCells.vue")
    },
    props: {
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
        khateebPreferences: {
            type: Array,
            required: true
        },
        location: {
            type: Object,
            required: true
        },
        timing: {
            type: Object,
            required: true
        },
        selectedDate: {
            type: Date,
            required: true
        }
    },
    data() {
        return {
            jummahStaticTags,
            showJummah: true
        }
    },
    methods: {
        jummahTiming() {
            return timingHelpers.timingDisplay(this.timing)
        },
        renderJummahTag(viewingWeek) {
            if (viewingWeek === 'past')
                return jummahStaticTags.pastTags.general
            else if (viewingWeek === 'future')
                return jummahStaticTags.futureTags.general
            else if (viewingWeek === 'current' && this.reciever === 'institutionAdmin' && this.oneKhateebWasNotified())
                return jummahStaticTags.currentWeekTags.notified
            else
                return jummahStaticTags.defaultTag
        },
        updateDisplay() {
            if (!this.preferenceEntryExists)
                return 'N/A'
            const updates = this.khateebPreferences
                .map(k => new Date(k.updatedAt).getTime())
                .filter(unixTime => !isNaN(unixTime))
            const mostRecentUpdate = new Date(Math.max(...updates))
            return this.utils.dynamicDisplayDate(mostRecentUpdate)
        },
        oneKhateebWasNotified() {
            return this.khateebPreferences.find(p => p.notified)
        },
        rerenderCell() {
            this.showJummah = false
            this.$nextTick(() => this.showJummah = true)
        }
    },
    computed: {
        preferenceEntryExists() {
            let exists = false
            this.khateebPreferences.forEach(k => { 
                if (k.createdAt)
                    exists = true
             })
            return exists
        },
    },
    watch: {
        khateebPreferences() {
            this.rerenderCell()
        },
        selectedDate() {
            this.rerenderCell()
        }
    }
}
</script>

<style lang="scss" scoped>

.icon-button {
    height: 40px;
    width: 40px;
    font-size: 18px;
    margin: 0 0 0 0;
    margin-right: 10px;
    padding: 0 0 0 0;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.settings-icon-container {
    margin-top: 10px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.jummah-status-container {
    margin-bottom: 25px;
}

.jummahPreferences {
    background: getColor("silver");
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    padding-top: 10px;
    padding-bottom: 20px;
    width: 50%;
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

div {
    &.timing {
        font-size: 14px;
        text-decoration: underline;
        color: getColor("offWhite");
        margin-bottom: 2px;
    }
}

.timing-container {
    background: getColor("offWhite");
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    display: flex;
    flex-direction: column;
    width: 50%;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 10px;
}

.timing-label {
    font-size: 25px;
}

@media screen and (max-width: $phoneWidth) {

    .jummahPreferences {
        border-radius: 0;
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        padding-top: 0;
        width: 100%;
    }

    .last-updated {
        font-size: 2.2vh;
    }

    .timing-container {
        border-radius: 0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        width: 100%;
    }

    .icon-button {
        height: 30px;
        width: 30px;
        font-size: 15px;
    }

    .timing-label {
        font-size: 20px;
    }
}
</style>
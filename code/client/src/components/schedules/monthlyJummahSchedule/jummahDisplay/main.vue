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
                <button 
                    :disabled="viewingWeekIsCurrentPastOrFuture === 'past'" 
                    class="icon-button blue"
                    @click="$emit('open-settings', { khateebPreferences, timing, location })"
                >
                    ⚙️
                </button>
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
            const timing = new Date()
            timing.setHours(this.timing.hour, this.timing.minute, 0, 0)
            return timing.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
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

.settings-icon {
    width: 100%;
}

.icon-button {
    height: 30px;
    width: 30px;
    font-size: 15px;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.settings-icon-container {
    width: 15%;
    height: 10px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: 10px;
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
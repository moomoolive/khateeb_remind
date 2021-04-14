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

        <div :class="`jummahPreferences ${userHasSeenJummahs() ? '' : 'glow'}`">
            
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
                :khateebs="khateebsAvailableForThisTiming"
                :khateebPreferences="khateebPreferences"
                :location="location"
                :timing="timing"
                :selectedDate="selectedDate"
                @new-preference="$emit('new-preference', $event)"
                @update-preference="$emit('update-preference', $event)"
            />

            <div v-if="reciever === 'institutionAdmin'">
                <collapse-transition :dimension="`width`" :duration="450">
                    <div 
                        v-show="
                            khateebsUnavailableForThisTiming.length > 0 && 
                            viewingWeekIsCurrentPastOrFuture !== 'past'
                        " 
                        class="unavailable-khateebs-position"
                    >
                        <div class="unavailable-khateebs-this-timing-header-container" @click="toggleUnavailableKhateebs()">
                            <div>
                                <img 
                                    src="~@/assets/misc/rightArrow.png" 
                                    :class="`dropdown-arrow ${showingUnavailable ? 'showing': ''}`"
                                    alt="dropdown arrow"
                                >
                            </div>

                            <div class="unavailable-khateebs-this-timing-header">
                                Khateebs Unavailable for this Timing
                            </div>

                            <div :class="showingUnavailable ? 'unavailable-khateeb-count-invisible' : ''">
                                <span class="red">({{ khateebsUnavailableForThisTiming.length }})</span>
                            </div>

                        </div>
                        
                        <collapse-transition :duration="450">
                            <div v-show="showingUnavailable">
                                <tag-circle
                                    v-for="(khateeb, khateebIndex) in khateebsUnavailableForThisTiming"
                                    class="unavailable-khateeb-tag"
                                    :key="khateebIndex"
                                    :info="{
                                        words: khateebName(khateeb),
                                        color: 'grey',
                                        icon: '👳'
                                    }"
                                    :square="true"
                                    :size="`small`"
                                    :textColor="`blue`"
                                />
                            </div>
                        </collapse-transition>

                    </div>
                </collapse-transition>
            </div>

            <div class="last-updated">
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
import khateebHelpers from '@/libraries/khateebs/main.js'
import sessionStorageHelpers from '@/libraries/sessionStorage/main.js'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: 'jummahDisplayer',
    components: {
        tagCircle,
        "institutionAdmin": () => import('./khateebInfoCells/adminCells.vue'),
        "khateeb": () => import("./khateebInfoCells/khateebCells.vue"),
        CollapseTransition
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
            showJummah: true,
            showingUnavailable: false
        }
    },
    methods: {
        toggleUnavailableKhateebs() {
            this.showingUnavailable = !this.showingUnavailable
        },
        khateebName(khateeb) {
            return khateebHelpers.khateebName(khateeb)
        },
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
        findLatestUpdate() {
            if (!this.preferenceEntryExists)
                return null
            const updates = this.khateebPreferences
                .map(k => new Date(k.updatedAt).getTime())
                .filter(unixTime => !isNaN(unixTime))
            return new Date(Math.max(...updates))
        },
        userHasSeenJummahs() {
            const latestUpdate = this.findLatestUpdate()
            if (!latestUpdate)
                return true
            else if (this.hasSeenJummahs())
                return true
            else
                return latestUpdate.getTime() < new Date(this.$store.state.user.userInfo.lastLogin).getTime()
        },
        updateDisplay() {
            const latestUpdate = this.findLatestUpdate()
            if (!latestUpdate)
                return 'N/A'
            else
                return this.utils.dynamicDisplayDate(latestUpdate)
        },
        oneKhateebWasNotified() {
            return this.khateebPreferences.find(p => p.notified)
        },
        rerenderCell() {
            this.showJummah = false
            this.$nextTick(() => this.showJummah = true)
        },
        setSeenJummahs() {
            sessionStorageHelpers.commit("seenJummahs", true)
        },
        hasSeenJummahs() {
            return sessionStorageHelpers.get("seenJummahs")
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
        khateebsAvailableForThisTiming() {
            return this.khateebs
                .filter(k => {
                    if (k.availableTimings.length < 1)
                        return true
                    else 
                        return k.availableTimings.find(t => t === this.timing._id) 
                })
        },
        khateebsUnavailableForThisTiming() {
            return this.khateebs.filter(k => {
                return k.availableTimings.length > 0 && !k.availableTimings.find(t => t === this.timing._id)
            })
        }
    },
    watch: {
        khateebPreferences() {
            this.rerenderCell()
        },
        selectedDate() {
            this.rerenderCell()
        }
    },
    mounted() {
        this.$nextTick(() => {
            const twoSecondsInMilliseconds = 2_000
            window.setTimeout(() => this.setSeenJummahs(), twoSecondsInMilliseconds)
        })
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

@keyframes glow { 
    0% { background-color: getColor("silver"); }
    50% { background-color: getColor("yellow") }
    100% { background-color: getColor("silver"); } 
}

.jummahPreferences {
    background: getColor("silver");
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    padding-top: 10px;
    padding-bottom: 20px;
    width: 50%;

    &.glow {
        animation: glow linear 3s 8;
    }
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
    margin-top: 20px;
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

.dropdown-arrow {
    height: 14px;
    margin-right: 10px;
    &.showing {
        transform: rotate(90deg);
    }
}

.unavailable-khateebs-this-timing-header {
    font-size: 15px;
    font-weight: bold;
    text-align: left;
}

.unavailable-khateebs-this-timing-header-container {
    @include flexboxDefault();
    width: 95%;
}

.unavailable-khateebs-position {
    width: 80%;
    @include centerMargin();
    margin-top: 20px;
}

.unavailable-khateeb-count-invisible {
    visibility: hidden;
}

.unavailable-khateeb-tag {
    margin-top: 10px;
    margin-bottom: 10px;
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

    .dropdown-arrow {
        height: 11px;
        margin-right: 7px;
    }

    .unavailable-khateebs-this-timing-header {
        font-size: 12px;
    }
}
</style>
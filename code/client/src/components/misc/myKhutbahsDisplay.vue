<template>
    <div class="container">
        
        <div v-if="header" class="khutbahs-container-header">
            {{ header }}
        </div>

        <div v-if="khutbahs.length > 0" :class="`khutbahs-container`">
            <div 
                v-for="(khutbah, khutbahIndex) in khutbahs"
                :key="khutbahIndex"
                class="khutbah-container"
            >
                
                <div class="updated-at-text">
                    Update: 
                    <span class="blue">
                        <b>{{ _utils.dynamicDisplayDate(khutbah.updatedAt) }}</b>
                    </span>
                </div>
                
                <div class="date-text">
                    {{ new Date(khutbah.date).toLocaleString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </div>

                <div class="location-text">
                    {{ locationDisplay(khutbah) }}
                </div>

                <div class="tags-container">

                    <tag-circle
                        class="info-tag role"
                        :info="{ 
                            words: khutbah.isBackup ? 'Backup' : 'Main Khateeb',
                            icon: '👳',
                            color: 'purple'
                        }"
                    />

                    <tag-circle
                        class="info-tag time"
                        :info="{ 
                            words: timingDisplay(khutbah),
                            icon: '⏲️',
                            color: 'blue'
                        }"
                    />

                    <tag-circle
                        v-if="khutbah.fromDefaults"
                        class="info-tag time"
                        :info="{ 
                            words: 'Regular',
                            icon: '📅',
                            color: 'red'
                        }"
                    />

                </div>

                <div>
                    <div class="status-header">
                        <span class="blue">
                            <u>Status</u>
                        </span>
                    </div>
                    <div class="status-text">
                        {{ statusText(khutbah) }}
                        <span v-if="khutbah.notified">
                            <br><br>📦 You've Been Notified
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else :class="`no-content-text`">
            {{ noKutbahsMessage }}
        </div>

    </div>
</template>

<script>
import tagCircle from '@/components/general/tagCircle.vue'

import timingHelpers from '@/libraries/timings/main.js'

export default {
    name: "myKhutbahDisplayer",
    components: {
        tagCircle
    },
    props: {
        khutbahs: {
            type: Array,
            required: true
        },
        noKutbahsMessage: {
            type: String,
            required: false,
            default: "No khutbahs to show..."
        },
        containerColor: {
            type: String,
            required: false,
            default: "silver"
        },
        header: {
            type: String,
            required: false
        },
        timings: {
            type: Array,
            required: true
        },
        locations: {
            type: Array,
            required: true
        }
    },
    methods: {
        statusText({ isGivingKhutbah, isBackup }) {
            if (isGivingKhutbah && isBackup)
                return `Main khateeb canceled. You are scheduled to substitute.`
            else if (isGivingKhutbah)
                return `You are schedule to give this khutbah.`
            else if (!isGivingKhutbah && !isBackup)
                return `Your admin scheduled a backup khateeb in your place.`
            else
                return `You haven't been asked to substitute for this khutbah yet.`
        },
        timingDisplay({ timingID }) {
            const timing = this.timings.find(t => t._id === timingID)
            return timingHelpers.timingDisplay(timing)
        },
        locationDisplay({ locationID }) {
            const location = this.locations.find(l => l._id === locationID)
            return `🕌 ${location.name}`
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    font-size: 16px;
}

.khutbahs-container-header {
    font-size: 22px;
    font-weight: bold;
    text-decoration: underline dotted;
}

.container {
    width: 85%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.khutbahs-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 10px;
    margin-bottom: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 7px;
}

.khutbah-container {
    width: 80%;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    background: get-color("silver");
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.34) 0px 3px 8px;
    margin-bottom: 15px;
    margin-top: 15px;
    padding: 10px 10px 10px 10px;
}

.role-text {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: left;
}

.date-text {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.status-header {
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.updated-at-text {
    @include alternate-font();
    font-size: 13px;
    text-align: left;
    margin-bottom: 10px;
}

.no-content-text {
    margin-top: 10px;
    width: 85%;
    max-width: 430px;
    margin-left: auto;
    margin-right: auto;
    background: get-color("silver");
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom: 30px;
}

.status-text {
    background: get-color("grey");
    color: get-color("off-white");
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
}

.info-tag {
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
}

.location-text {
    font-size: 18px;
    margin-bottom: 10px;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

@media screen and (max-width: $phone-width) {
    .khutbahs-container {
        flex-direction: column;
    }

    .updated-at-text {
        font-size: 11px;
    }
}
</style>
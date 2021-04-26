<template>
    <div>
        <div v-for="(preference, preferenceIndex) in khateebPreferencesMirror" :key="preferenceIndex">
            
            <div class="preference-number">
                {{ preferenceIndex === 0 ? 'Main Khateeb' : 'Backup' }}
            </div>

            <div class="preference-container">
                <div v-if="currentWeek === 'past'" class="preference-number khateeb-name">
                    {{ readMeKhateebName(preference.khateebID) }}
                </div>

                <span v-else>
                    <select
                        v-if="showDropdown" 
                        v-model="preference.khateebID" 
                        @change="khateebSelectionChanged($event, preferenceIndex)"
                    >
                        <option :value="_config.nullId">None</option>
                        <option
                            v-for="
                                (khateeb, khateebIndex) 
                                in khateebs
                                    .filter(k => {
                                        return k._id !== khateebPreferencesMirror[preferenceIndex === 0 ? 1 : 0].khateebID 
                                    })
                            "
                            :key="khateebIndex"
                            :value="khateeb._id"
                        >
                            {{ khateebName(khateeb) }}
                        </option>
                    </select>
                </span>
                
                <div v-if="preference.khateebID.toLowerCase() !== _config.nullId">

                    <div 
                        v-show="preference.isGivingKhutbah" 
                        class="current-week-notification"
                    >
                        <span class="green">
                            📢 {{ currentWeek === 'past' ? "Gave" : "Is Giving"}} Khutbah
                        </span>
                    </div>

                    <div 
                        v-show="preference.notified" 
                        class="current-week-notification"
                    >
                       <span class="blue">📦 Notified</span>
                    </div>

                </div>

            </div>

        </div>
    </div>
</template>

<script>
import khateebHelpers from '@/libraries/khateebs/main.js'

export default {
    name: "adminKhateebCells",
    props: {
        khateebs: {
            type: Array,
            required: true
        },
        currentWeek: {
            required: true,
            type: String
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
            cachedKhateebPreferencesMirror: new Array.from(2).fill({ khateebID: this._config.nullId }),
            khateebPreferencesMirror: new Array.from(2).fill({ khateebID: this._config.nullId }),
            showDropdown: true
        }
    },
    methods: {
        readMeKhateebName(khateebID="none") {
            if (khateebID === this._config.nullId)
                return "None"
            const khateeb = this.khateebs.find(k => k._id === khateebID)
            if (!khateeb)
                return "None"
            else
                return this.khateebName(khateeb)
        },
        khateebName(khateeb) {
            return khateebHelpers.khateebName(khateeb)
        },
        async khateebSelectionChanged(change, index) {
            const khateebID = change.target.value
            if (this.noPreferenceIndicated(index) || this.khateebPreferences[index].upsert) {
                const isBackup = index !== 0
                this.$emit('new-preference', { 
                    khateebID, 
                    isBackup, 
                    isGivingKhutbah: !isBackup,
                    notified: false,
                    notificationID: this._config.nullId,
                    timingID: this.timing._id,
                    institutionID: this.location.institutionID,
                    locationID: this.location._id,
                    date: this.preferenceDate().toISOString() 
                })
            }
            else {
                this.$emit('update-preference', { 
                    ...this.khateebPreferences[index], 
                    khateebID,
                    notified: false,
                    notificationID: this._config.nullId 
                })
            }
            this.cachePreferences()
        },
        setInitialValue() {
            this.khateebPreferences.forEach((preference, index) => {
                if (this.noPreferenceIndicated(index))
                    return
                else
                    this.khateebPreferencesMirror[index] = { ...preference }
            })
            this.cachePreferences()
        },
        reverseChangeAndAlert(index, msg) {
            this._utils.alert(msg)
            this.reverseChanges(index)
            return false
        },
        noPreferenceIndicated(index) {
            return Object.keys(this.khateebPreferences[index]).length < 1
        },
        cachePreferences() {
            this.khateebPreferencesMirror.forEach((p, index) => {
                this.cachedKhateebPreferencesMirror[index] = { ...p }
            })
        },
        reverseChanges(index) {
            this.khateebPreferencesMirror.splice(index, 1, { ...this.cachedKhateebPreferencesMirror[index] })
            this.rerenderDropdown()
        },
        rerenderDropdown() {
            this.showDropdown = false
            this.$nextTick(() => this.showDropdown = true)
        },
        preferenceDate() {
            const date = new Date()
            date.setUTCFullYear(this.selectedDate.getFullYear())
            date.setUTCMonth(this.selectedDate.getMonth())
            date.setUTCDate(this.selectedDate.getDate())
            date.setUTCHours(12, 0, 0, 0)
            return date
        }
    },
    created() {
        this.setInitialValue()
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

.preference-number { 
    text-align: left;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 17px;

    &.khateeb-name {
        font-weight: normal;
        font-size: 16px;
    }
}

.current-week-notification {
    font-size: 13px;
    text-align: left;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 7px;
}

.preference-container {
    margin-bottom: 30px;
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

    .preference-number { 
        font-size: 16px;
        &.khateeb-name {
            font-size: 15px;
        }
    }
    
    .current-week-notification {
        font-size: 12px;
    }

    button {
        font-size: 2.2vh;
    }
}
</style>
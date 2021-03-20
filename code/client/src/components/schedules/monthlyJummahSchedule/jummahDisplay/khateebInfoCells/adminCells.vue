<template>
    <div>
        <div v-for="(preference, preferenceIndex) in khateebPreferencesMirror" :key="preferenceIndex">
            
            <div class="preference-number">
                {{ preferenceIndex === 0 ? 'Main Khateeb' : 'Backup' }}
            </div>

            <div>
                <div v-if="currentWeek === 'past'" class="preference-number">
                    None
                </div>

                <span v-else>
                    <select
                        v-if="showDropdown" 
                        v-model="preference.khateebID" 
                        @change="khateebSelectionChanged($event, preferenceIndex)"
                    >
                        <option value="none">None</option>
                        <option
                            v-for="(khateeb, khateebIndex) in khateebs"
                            :key="khateebIndex"
                            :value="khateeb._id"
                        >
                            {{ khateebName(khateeb) }}
                        </option>
                    </select>
                </span>

            </div>

            <div>

                <div v-show="preference.isGivingKhutbah" class="current-week-notification">
                    ⭐ Khateeb
                </div>

                <div v-show="preference.notified" class="current-week-notification">
                    📦 Notified
                </div>

            </div>

        </div>
    </div>
</template>

<script>
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
            cachedKhateebPreferencesMirror: [{ khateebID: 'none' }, { khateebID: 'none' }],
            khateebPreferencesMirror: [{ khateebID: 'none' }, { khateebID: 'none' }],
            showDropdown: true
        }
    },
    methods: {
        khateebName(khateeb) {
            let name = `${khateeb.firstName} ${khateeb.lastName}`
            if (khateeb.title.toLowerCase() !== 'none')
                name += khateeb.title + " "
            return name
        },
        async khateebSelectionChanged(change, index) {
            const khateebID = change.target.value
            const confirm = await this.allowedToMutate(index)
            if (!confirm)
                return
            if (this.noPreferenceIndicated(index)) {
                const isBackup = index !== 0
                this.$emit('new-preference', { 
                    khateebID, 
                    isBackup, 
                    isGivingKhutbah: !isBackup,
                    notified: false,
                    notificationID: 'none',
                    timingID: this.timing._id,
                    institutionID: this.location.institutionID,
                    locationID: this.location._id,
                    date: this.preferenceDate().toISOString() 
                })
            }
            else
                this.$emit('update-preference', { 
                    ...this.khateebPreferences[index], 
                    khateebID,
                    notified: false,
                    notificationID: 'none' 
                })
            this.cachePreferences()
        },
        async allowedToMutate(index) {
            if (this.khateebPreferencesMirror[0].khateebID === this.khateebPreferencesMirror[1].khateebID)
                return this.reverseChangeAndAlert(index, `Main and backup khateeb cannot be the same`)
            return true
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
            this.utils.alert(msg)
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
        },
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
    margin-top: 10px;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 17px;
}

.current-week-notification {
    font-size: 17px;
    text-align: left;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    font-weight: bold;
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
        margin-top: 4vh;
        font-size: 2.5vh;
    }
    
    .current-week-notification {
        font-size: 2.7vh;
    }

    button {
        font-size: 2.2vh;
    }
}
</style>
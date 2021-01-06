<template>
    <div>
        <select 
            v-model="schedule.monthlySchedule[displayedWeek].khateebs[prayerTiming]" 
        >
            <option
                v-for="(khateeb, khateebNumber) in khateebList" :key="khateebNumber"
                :value="khateeb"
            >
                {{ khateeb.firstName }} {{ khateeb.lastName }}
            </option>
            <option selected :value="emptyKhateeb">
                TBD
            </option>
        </select>
        <button 
            @click="revertToOriginal(prayerTiming)"
            class="grey"
        >
            Revert
        </button>
    </div>
</template>

<script>
export default {
    name: 'adminKhateebDisplay',
    props: {
        schedule: {
            type: Object,
            required: true
        },
        displayedWeek: {
            type: [Number, String],
            required: true
        },
        prayerTiming: {
            type: [String, Number],
            required: true
        },
        originalSchedule: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            emptyKhateeb: null,
            khateebList: null,
            data: null
        }
    },
    methods: {
        async fetchKhateebs() {
            const khateebs = await this.$API.admin.getKhateebs('no')
            if (khateebs === `you haven't created any khateebs!`) {
                this.$emit('no-khateebs')
            } else {
                this.khateebList = khateebs.previousEntries
                this.emptyKhateeb = khateebs.emptySchema
                this.modifySavedOnKhateebs()
            }
        },
        toBeDecidedIndicator(khateebArray) {
            const randomKhateeb = this._.deepCopy(khateebArray[0])
            for (let field in randomKhateeb) {
                randomKhateeb[field] = null
            }
            return randomKhateeb
        },
        revertToOriginal(index) {
            const originalData = this._.deepCopy(this.originalSchedule.monthlySchedule[this.displayedWeek].khateebs[index])
            this.schedule.monthlySchedule[this.displayedWeek].khateebs.splice(index, 1, originalData)
        },
        modifySavedOnKhateebs() {
            const savedOn = this.schedule.monthlySchedule[this.displayedWeek].khateebs[this.prayerTiming].savedOn
            if (!savedOn || !this.khateebList)
                return
            this.khateebList = this.khateebList.map(khateeb => {
                return { ...khateeb, savedOn }
            })
        }
    },
    computed: {
        x() {
            return this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
        }
    },
    created() {
        this.fetchKhateebs()
    }
}
</script>

<style lang="scss" scoped>
button {
    margin-top: 0.3vh;
    margin-bottom: 0;
    height: 4vh;
}
</style>
<template>
    <div>
        <select 
            v-model="schedule.monthlySchedule[displayedWeek][prayerTiming]" 
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
            type: Number,
            required: true
        },
        originalSchedule: {
            type: [Object],
            required: true
        }
    },
    data() {
        return {
            emptyKhateeb: null,
            khateebList: null
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
            const originalData = this._.deepCopy(this.originalSchedule.monthlySchedule[this.displayedWeek][index])
            this.schedule.monthlySchedule[this.displayedWeek].splice(index, 1, originalData)
        },
        deleteExcessValues() {
            const x = this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
            if (x.savedOn) delete x.savedOn
        }
    },
    computed: {
        x() {
            return this.schedule.monthlySchedule[this.displayedWeek][this.prayerTiming]
        }
    },
    created() {
        this.deleteExcessValues()
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
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
        <button @click="revertToOriginal(prayerTiming)">Revert</button>
    </div>
</template>

<script>
import API from '../../../utils/apiCalls.js'

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
            const khateebs = await API.getKhateebs('no')
            if (khateebs === `you haven't created any khateebs!`) {
                this.$emit('no-khateebs')
            } else {
                this.khateebList = khateebs.previousEntries
                this.emptyKhateeb = khateebs.emptySchema
            }
        },
        toBeDecidedIndicator(khateebArray) {
            const randomKhateeb = JSON.parse(JSON.stringify(khateebArray[0]))
            for (let field in randomKhateeb) {
                randomKhateeb[field] = null
            }
            return randomKhateeb
        },
        revertToOriginal(index) {
            const originalData = JSON.parse(JSON.stringify(this.originalSchedule.monthlySchedule[this.displayedWeek][index]))
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
    background-color: $grey;
    color: white;
    border: solid black 1px;
    outline: none;
    margin-left: 3px;
}
</style>
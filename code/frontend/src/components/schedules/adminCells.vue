<template>
    <div>
        <div v-if="data">
            <div 
                v-for="(preference, preferenceNo) in data.khateebPreference"
                :key="preferenceNo"
            >
                Preference {{ preferenceNo + 1 }}
                <div v-if="readOnly(preference)">
                    {{ readOnlyKhateebDisplay(preference.khateebID) }}
                </div>
                <select
                    v-else 
                    @change="change($event.target.value, preferenceNo, preference._id)"
                >
                    <option value="TBD">TBD</option>
                    <option
                        v-for="(khateeb, khateebNo) in khateebs"
                        :key="khateebNo"
                        :value="khateeb._id"
                    >
                        {{ khateebDisplay(khateeb) }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "adminKhateebCells",
    props: {
        timing: {
            type: Object,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        },
        weekOf: {
            type: String,
            required: true
        },
        viewingMonth: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            data: null
        }
    },
    methods: {
        change($event, number, id) {
            const info = {
                val: $event,
                number,
                id
            }
            this.$emit('changed', info)
        },
        khateebDisplay(khateeb) {
            let base = `${khateeb.firstName} ${khateeb.lastName}`
            if (khateeb.title !== 'none')
                base = `${khateeb.title} ${base}`
            return base 
        },
        readOnlyKhateebDisplay(khateebID) {
            const found = this.khateebs.find(khateeb => khateeb._id === khateebID)
            if (found)
                return this.khateebDisplay(found)
            else
                return khateebID
        },
        weekIsInPast() {
            if (this.viewingMonth === 'past')
                return true
            else if (this.viewingMonth === 'future')
                return false
            else 
                return new Date().getDate() > parseInt(this.weekOf)
        },
        readOnly(preference) {
            return this.weekIsInPast() || this.timing.confirmed || preference.notified
        }
    },
    created() {
        this.data = this._.deepCopy(this.timing)
    }
}
</script>

<style>

</style>
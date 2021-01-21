<template>
    <div v-if="country && statesOfCountry">
        <div class="formLabel">
                State
        </div>
        <select v-model="selectedState" @change="$emit('changed', $event.target.value)">
            <option
                v-for="option in statesOfCountry"
                :key="option"
                :value="option"
            >
                {{ option }}
            </option>
        </select>
    </div>
</template>

<script>
import states from './states.json'

export default {
    name: "formStateExt",
    props: {
        country: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            states,
            selectedState: null
        }
    },
    computed: {
        statesOfCountry() {
            if (!this.states[this.country])
                return null
            else
                return this.states[this.country]
        }
    },
    watch: {
        country(newVal) {
            if (this.statesOfCountry)
                this.selectedState = this.statesOfCountry[0]
        }
    },
    created() {
        this.selectedState = this.statesOfCountry[0]
        this.$emit("changed", this.selectedState)
    }
}
</script>

<style>

.formLabel {
    margin-top: 2.5vh;
    margin-bottom: 1.5vh;
    font-weight: 500;
    font-size: 2.3vh;
}

</style>
<template>
    <div v-if="bindedTo && statesOfCountry">
        <slot></slot>
        <select v-model="selectedState" @change="toMain()">
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
        bindedTo: {
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
    methods: {
        toMain(options) {
            this.$emit("changed", { val: this.selectedState, ...options})
        }
    },
    computed: {
        statesOfCountry() {
            if (!this.states[this.bindedTo])
                return null
            else
                return this.states[this.bindedTo]
        }
    },
    watch: {
        bindedTo(newVal) {
            if (this.statesOfCountry)
                this.selectedState = this.statesOfCountry[0]
        },
        statesOfCountry(newVal, oldVal) {
            if (!newVal && oldVal)
                this.toMain({ deleted: true })
            if (newVal && !oldVal)
                this.toMain({ created: true })
        }
    },
    created() {
        this.selectedState = this.statesOfCountry[0]
        this.toMain({ created: true })
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
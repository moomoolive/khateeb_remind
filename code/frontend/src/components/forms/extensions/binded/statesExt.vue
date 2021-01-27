<template>
    <div v-if="bindedTo && statesOfCountry && show">
        <slot></slot>
        <dropdown-primitive 
            :options="{
                selectOptions: statesOfCountry
            }"
            @changed="process($event)"
        />
    </div>
</template>

<script>
import states from './states.json'
import dropdownPrimitive from '@/components/forms/extensions/primitives/dropdown.vue'

export default {
    name: "formStateExt",
    components: {
        dropdownPrimitive
    },
    props: {
        bindedTo: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            states,
            show: true
        }
    },
    methods: {
        process($event) {
            this.$emit("changed", $event)
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
        statesOfCountry(newVal, oldVal) {
            if (!newVal && oldVal)
                this.process({ deleted: true })
            if (newVal && oldVal) {
                this.show = false
                this.$nextTick(() => { this.show = true })
            }
        }
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
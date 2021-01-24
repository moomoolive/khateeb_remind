<template>
    <div>
        <select 
            v-model="currentlySelected"
            @change="$emit('changed', { val: currentlySelected })"
        >
            <option
                v-for="(option, index) in options.selectOptions"
                :key="index"
                :value="value(option)"
            >
                {{ display(option) }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'formDropdownExt',
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentlySelected: this.startValue()
        }
    },
    methods: {
        display(option) {
            if (typeof this.options.display !== "undefined")
                return option[this.options.display]
            else
                return option
        },
        value(option) {
            if (typeof this.options.value !== 'undefined')
                return option[this.options.value]
            else
                return option
        },
        startValue() {
            if (typeof this.options.value !== 'undefined')
                return this.options.selectOptions[0][this.options.value]
            else
                return this.options.selectOptions[0]
        }
    },
    created() {
        this.$emit('changed', { val: this.currentlySelected, created: true })
    }
}
</script>

<style>

</style>
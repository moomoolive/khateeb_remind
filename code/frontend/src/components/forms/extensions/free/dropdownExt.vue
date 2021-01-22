<template>
    <div>
        <select 
            v-model="currentlySelected"
            @change="$emit('changed', { val: currentlySelected })"
        >
            <option
                v-for="option in options.selectOptions"
                :key="option"
                :value="option"
            >
                {{ option }}
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
            currentlySelected: this.options.selectOptions[0]
        }
    },
    created() {
        this.$emit('changed', { val: this.currentlySelected, created: true })
    }
}
</script>

<style>

</style>
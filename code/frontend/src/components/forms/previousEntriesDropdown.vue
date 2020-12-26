<template>
    <div>
        <select @change="$emit('changed', $event.target.value)">
            <option value="New">Create New {{ name }}</option>
            <option
            v-for="(entry, ID) in previousEntries" :key="ID"
            :value="ID"
            >
                <span v-for="field in displayName" :key="field">
                    {{ entry[field] }}
                </span>
            </option>
        </select><br>
        <button
            @click="$parent.remove()"
            v-if="selected !== 'New'"
            class="red"
        >
            Delete this {{ name }}
        </button>
    </div>
</template>

<script>
export default {
    name: "previousEntriesDropdown",
    props: {
        previousEntries: {
            type: Array,
            required: true
        },
        inputData: {
            type: Object,
            required: true
        },
        selected: {
            type: [String, Number],
            required: true
        },
        displayName: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            name: this.$parent.formName
        }
    }
}
</script>

<style>

</style>
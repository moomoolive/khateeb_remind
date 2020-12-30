<template>
    <div>
        <select @change="$emit('changed', $event.target.value)">
            <option value="New">Create New {{ name }}</option>
            <option
            v-for="(entry, ID) in previousEntries" :key="ID"
            :value="ID"
            >
                {{ namingConvention ? namingConvention(entry) : defaultNamingConvention(entry) }}
            </option>
        </select><br>
        <button
            @click="$emit('remove')"
            v-if="inputData._id"
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
        namingConvention: {
            type: Function,
            required: false
        },
        formName: {
            type: String,
            required: true
        }
    },
    methods: {
        remove() {
            this.emit('delete', this.inputData._id)
        },
        defaultNamingConvention(data) {
            const keys = Object.keys(data)
            return data[keys[0]]
        }
    },
    computed: {
        name() {
            return this._.stringFormat(this.formName).slice(0, -1)
        }
    }
}
</script>

<style>

</style>
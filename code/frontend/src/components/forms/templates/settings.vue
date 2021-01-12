<template>
    <div>
        <Form
            :name="name"
            :emptySchema="inputData.options"
            :backgroundColor="backgroundColor"
            :invalidations="invalidations"
            :customInvalidMsg="customInvalidMsg"
            :dropdown="dropdown"
            :inputAlias="inputAlias"
            @submitted="submit($event)"
        />
    </div>
</template>

<script>
import Form from '@/components/forms/formRenderer.vue'

export default {
    name: "settingsForm",
    components: {
        Form
    },
    props: {
        name: {
            type: String,
            required: true
        },
        backgroundColor: {
            type: String,
            required: false
        },
        previousEntries: {
            type: Array,
            required: false
        },
        emptySchema: {
            type: Object,
            required: true
        },
        dropdown: {
            type: Object,
            required: false
        },
        invalidations: {
            type: Object,
            required: false
        },
        customInvalidMsg: {
            type: Object,
            required: false
        },
        inputAlias: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            inputData: null
        }
    },
    methods: {
        submit($event) {
            this.inputData.options = $event
            this.$emit('submitted', this.inputData)
        }
    },
    created() {
        if (this.previousEntries && this.previousEntries[0]) {
            this.inputData = this._.deepCopy(this.previousEntries[0])
        } else this.inputData = this._.deepCopy(this.emptySchema)
    }
}
</script>

<style>

</style>
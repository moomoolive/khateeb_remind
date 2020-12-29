<template>
    <div 
        class="gradient1"
        v-if="inputData"
    >
        <previous-entries-dropdown 
            :inputData="data"
            :previousEntries="previousEntries"
            :selected="selected"
            @changed="selected = $event"
            :displayName="['headline']"
        />
        <form-input
            :inputData="data"
            :bigText="['content']"
            :invalidations="invalidations"
            :textFieldInvalidMsg="{
                content: 'Content cannot be empty'
            }"
            :invalidationList="invalidations"
        />
        <button
            class="grey"
            @click="submit()"
        >
            Submit
        </button>
    </div>
</template>

<script>
import formInput from './formRenderer.vue'
import previousEntriesDropdown from './previousEntriesDropdown.vue'

import invalidation from '@/utils/validationChecks/main.js'

export default {
    name: 'formMain',
    components: {
        formInput,
        previousEntriesDropdown
    },
    props: {
        inputData: {
            type: Object,
            required: false
        },
        previousEntries: {
            type: [Array],
            required: false
        },
        emptySchema: {
            type: Object,
            required: false
        },
        bigText: {
            type: [Array],
            required: false,
            default: () => []
        },
        textFieldInvalidMsg: {
            type: Object,
            required: false
        },
        doNotRender: {
            type: Array,
            required: false,
            default: () => []
        },
        invalidations: {
            type: Object,
            required: false
        },
        displayName: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            selected: 'New',
            data: null,
            isInvalid: {
                phoneNumber: true
            }
        }
    },
    methods: {
        resetForm() {
            this.data = this._.deepCopy(this.emptySchema)
            this.selected = 'New'
        },
        fieldIsEmpty(field) {
            const x = this.data.options ?  this.data.options : this.data
            return invalidation.fieldIsEmpty(x[field])
        },
        fieldExists(field) {
            return this.data[field] || this.data.options[field]
        }
    },
    computed: {
        emptyField() {
            if (!this.inputData) {
                return true
            }
            const validations = {}
            this.invalidations.emptyField.forEach(field => { 
                validations[field] = this.fieldIsEmpty(field)
            })
            return validations
        },
        phoneNumberWatcher() {
            if (!this.data) {
                if (!this.fieldExists('phoneNumber')) return null
            }
            const x = this.data.options ? this.data.options : this.data
            return x.phoneNumber
        }
    },
    watch: {
        selected(newValue) {
            if (newValue === 'New') {
                this.resetForm()
            } else {
                this.data = this._.deepCopy(this.previousEntries[newValue])
            }
        },
        inputData(newVal) {
            this.data = newVal
        },
        async phoneNumberWatcher() {
            if (this.phoneNumberWatcher) {
                this.isInvalid.phoneNumber = await invalidation.phoneNumber(this.phoneNumberWatcher)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("yellow");

</style>
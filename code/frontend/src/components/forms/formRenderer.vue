<template>
    <div 
        :class="`gradient${backgroundColor}`"
        v-if="data"
    >
        <previous-entries-dropdown 
            :inputData="data"
            :previousEntries="previousEntries"
            :formName="name"
            :namingConvention="previousEntriesNaming"
            v-if="previousEntries"
            @changed="selected = $event"
            @remove="remove()"
        />
        <form-input-renderer
            :inputData="data"
            :bigText="bigText"
            :customInvalidMsg="customInvalidMsg"
            :activeInvalidations="allActiveInvalidations"
            :doNotRender="doNotRender"
        />
        <button
            :class="buttonColor"
            :disabled="notReadytoSubmit"
            @click="submit()"
        >
            {{ buttonText }}
        </button>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

import previousEntriesDropdown from './subcomponents/previousEntriesDropdown.vue'
import formInputRenderer from './subcomponents/formInputRenderer.vue'

import invalidation from '@/utils/validationChecks/main.js'

export default {
    name: 'formMain',
    components: {
        formInputRenderer,
        previousEntriesDropdown
    },
    props: {
        name: {
            type: String,
            required: true
        },
        emptySchema: {
            type: Object,
            required: true
        },
        previousEntries: {
            type: [Array],
            required: false
        },
        previousEntriesNaming: {
            type: Function,
            required: false
        },
        bigText: {
            type: [Array],
            required: false,
            default: () => []
        },
        doNotRender: {
            type: Array,
            required: false,
            default: () => []
        },
        invalidations: {
            type: [Object, Array],
            required: false,
            default: () => []
        },
        customInvalidMsg: {
            type: Object,
            required: false
        },
        backgroundColor: {
            type: String,
            required: false,
            default: 'yellow-offWhite'
        },
        buttonColor: {
            type: String,
            required: false,
            default: 'grey'
        },
        buttonText: {
            type: String,
            required: false,
            default: 'Submit'
        },
        verifyBeforeAction: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            selected: 'New',
            data: null,
            originalData: null,
            nonCanadianPhone: null
        }
    },
    methods: {
        resetForm() {
            this.setDataAndCache(this.emptySchema)
            this.selected = 'New'
        },
        setDataAndCache(value) {
            this.data = this._.deepCopy(value)
            this.originalData = this._.deepCopy(this.data)
        },
        fieldIsEmpty(field) {
            const x = this.data.options ?  this.data.options : this.data
            return invalidation.fieldIsEmpty(x[field])
        },
        invalidPasswordRequirements(field) {
            return this.data[field].length < 6
        },
        addInvalidationIfActive(returnObject, invalidationName) {
            if (this[invalidationName]) {
                Object.assign(returnObject, this[invalidationName])
            }
        },
        submit() {
            const msg = `Are you sure you want to ${this.buttonText.toLowerCase()} this 
                ${this.name.slice(-1) === 's' ? this.name.slice(0, -1): this.name}?
                `.replace(/  +/g, '').replace('\n', '')
            if (this.verifyBeforeAction) {
                if (window.confirm(msg)) {
                    this.$emit('submitted', this.data)
                }
            } else this.$emit('submitted', this.data)
        },
        remove() {
            const msg = `Are you sure you want to remove this 
                ${this.name.slice(0, -1)}?
                `.replace(/  +/g, '').replace('\n', '')
            if (window.confirm(msg)) {
                this.$emit('remove', this.data._id)
            }
        }
    },
    computed: {
        emptyField() {
            if (!this.invalidations.emptyField) {
                return null
            }
            const validations = {}
            this.invalidations.emptyField.forEach(field => { 
                validations[field] = this.fieldIsEmpty(field)
            })
            return validations
        },
        phoneNumberWatcher() {
           if (!this.data) {
               return null
           }
           return this.data.phoneNumber
        },
        invalidPassword() {
            if (!this.invalidations.invalidPassword) {
                return null
            }
            const validations = {}
            this.invalidations.invalidPassword.forEach(field => {
                validations[field] = this.invalidPasswordRequirements(field)
            })
            return validations
        },
        notEqual() {
            if (!this.invalidations.notEqual) {
                return null
            }
            const validations = {}
            for (let [appliesTo, notEqualTo] of Object.entries(this.invalidations.notEqual)) {
                validations[appliesTo] = (this.data[appliesTo] !== this.data[notEqualTo])
            }
            return validations
        },
        allActiveInvalidations() {
            const possibleInvalidations = [
                'emptyField', 'invalidPassword', 'nonCanadianPhone', 'notEqual'
            ]
            let activeInvalidations = {}
            possibleInvalidations.forEach(invalidationName => {
                this.addInvalidationIfActive(activeInvalidations, invalidationName)
            })
            return activeInvalidations
        },
        sameAsOriginal() {
            return equal(this.data, this.originalData)
        },
        notReadytoSubmit() {
            if (!this.allActiveInvalidations) {
                return null
            }
            let x = false
            const invalidations = Object.keys(this.allActiveInvalidations)
            invalidations.forEach(field => { 
                if (this.allActiveInvalidations[field])  x = true
            })
            return x || this.sameAsOriginal
        }
    },
    watch: {
        selected(newValue) {
            if (newValue === 'New') {
                this.resetForm()
            } else {
                this.setDataAndCache(this.previousEntries[newValue])
            }
        },
        emptySchema(newVal) {
            this.data = newVal
        },
        async phoneNumberWatcher() {
            if (this.phoneNumberWatcher) {
                const isNotValid = await invalidation.phoneNumber(this.phoneNumberWatcher)
                this.nonCanadianPhone = { phoneNumber: isNotValid }
            }
        }
    },
    created() {
        this.setDataAndCache(this.emptySchema)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';

$rightColors: (
    "offWhite": 1,
    "green": 0.2
);

@each $rightColor, $opacityValue in $rightColors {
    @each $colorName, $color in $themeColors {
        @include gradient1(
            $colorLeft: $colorName,
            $opacityLeft: 0.5,
            $name: '#{$colorName}-#{$rightColor}' ,
            $colorRight: $rightColor,
            $opacityRight: $opacityValue
        );
    }
};

button {
    margin-top: 4vh;
}

</style>
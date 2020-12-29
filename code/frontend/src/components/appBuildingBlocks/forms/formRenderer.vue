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
            :bigText="['content']"
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
            required: false
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
            type: Object,
            required: false
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
            default: false
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
            if (this.data[field]) return this.data[field]
            if (this.data.options)  return this.data.options[field]
            return null
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
            if (!this.data || !this.invalidations || !this.invalidations.emptyField) {
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
                return null
            } else return this.fieldExists('phoneNumber')
        },
        passwordRequirements() {
            if (this.data.createNewPassword && this.data.createNewPassword !== null) {
                return this.data.createNewPassword.length < 6
            } else return null
        },
        notEqual() {
            if (!this.invalidations || !this.invalidations.notEqual) {
                return null
            }
            let x = false
            this.invalidations.notEqual.forEach(pair => {
                if (this.data[pair[0]] !== this.data[pair[1]]) x = true
            })
            return x
        },
        allActiveInvalidations() {
            let activeInvalidations = {}
            if (this.emptyField !== true) {
                activeInvalidations = { ...this.emptyField }
            }
            if (this.passwordRequirements !== null){
                activeInvalidations.createNewPassword = this.passwordRequirements
            }
            if (this.phoneNumberWatcher) {
                activeInvalidations.phoneNumber = this.isInvalid.phoneNumber
            }
            if (this.notEqual) {
                activeInvalidations.confirmNewPassword = this.notEqual
            }
            return activeInvalidations
        },
        notReadytoSubmit() {
            let x = false
            if (!this.allActiveInvalidations) {
                return x
            }
            const invalidations = Object.keys(this.allActiveInvalidations)
            invalidations.forEach(field => { 
                if (this.allActiveInvalidations[field])  x = true
            })
            return x
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
        emptySchema(newVal) {
            this.data = newVal
        },
        async phoneNumberWatcher() {
            if (this.phoneNumberWatcher) {
                this.isInvalid.phoneNumber = await invalidation.phoneNumber(this.phoneNumberWatcher)
            }
        }
    },
    created() {
        this.data = this._.deepCopy(this.emptySchema)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';

$rightColors: (
    "offWhite": 1,
    "green": 0.5
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
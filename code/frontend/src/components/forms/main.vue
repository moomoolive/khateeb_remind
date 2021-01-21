<template>
    <div :class="`gradient${backgroundColor} formContainer`" v-if="data && formIsSetup">
        <div v-if="formTitle" class="formTitle">
            {{ formTitle }}
        </div>
        <div v-for="(fieldData, fieldName) in structure" :key="fieldName">
            <div class="formLabel" :for="fieldName">
                {{ _.stringFormat(fieldName) }}
            </div>
            <div v-if="fieldData.type === 'textArea'">
                <textarea v-model="data[fieldName]"></textarea>
            </div>
            <div v-else-if="fieldData.type === 'dropdown'">
                <select v-model="data[fieldName]">
                    <option
                        v-for="option in fieldData.selectOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </option>
                </select>
                <states-ext 
                    v-if="extensionIncluded('states') && fieldName === 'country'"
                    :country="data.country"
                    @changed="extensionSupport('state', $event)"
                />
            </div>
            <div v-else-if="fieldData.type">
                <input
                    style="display: inline-block" 
                    :type="fieldData.type" 
                    :id="fieldName" 
                    v-model="data[fieldName]"
                >
            </div>
            <div v-else>
                <input 
                    type="text"
                    v-model="data[fieldName]" 
                    :id="fieldName"
                >
            </div>
            <div 
                v-if="fieldNeedsValidationAndIsInvalid(fieldName)"
                class="invalidFeedback"
            >
                {{ invalidFeedback(fieldName) }}
            </div>
        </div>
        <button 
            :class="buttonColor" 
            :disabled="!validSubmission"
            @click="submit()"
        >
            {{ buttonText }}
        </button>
        <div v-if="errorMsg" class="errorMsg">
            {{ errorMsg }}
        </div>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

export default {
    name: "formMain",
    props: {
        structure: {
            type: Object,
            required: true
        },
        basedOn: {
            type: Object,
            required: false
        },
        buttonText: {
            type: String,
            required: false,
            default: 'Submit'
        },
        buttonColor: {
            type: String,
            required: false,
            default: 'grey'
        },
        backgroundColor: {
            type: String,
            required: false,
            default: 'yellow-offWhite'
        },
        errorMsg: {
            type: String,
            required: false,
            default: ''
        },
        formTitle: {
            type: String,
            required: false,
            default: ''
        },
        extensions: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    components: {
        'statesExt': () => import('./statesExt.vue')
    },
    data() {
        return {
            data: null,
            originalData: null,
            validations: {},
            protectedFields: {},
            formIsSetup: false,
        }
    },
    methods: {
        fieldNeedsValidationAndIsInvalid(fieldName) {
            return typeof this.validateFields[fieldName] !== 'undefined' && !this.validateFields[fieldName]
        },
        extensionIncluded(name) {
            return !!this.extensions.find(ext => ext === name)
        },
        invalidFeedback(fieldName) {
            if (this.structure[fieldName].invalidMsg)
                return this.structure[fieldName].invalidMsg
            else
                return `Invalid ${this._.stringFormat(fieldName)}`
        },
        setData(inputData) {
            this.data = this._.deepCopy(inputData)
            this.originalData = this._.deepCopy(inputData)
        },
        createDataBasedOnStructure() {
            let data = {}
            for (let [fieldName, options] of Object.entries(this.structure)) {
                if (options.default)
                    data[fieldName] = options.default
                else if (options.type === 'dropdown')
                    data[fieldName] = options.selectOptions[0]
                else
                    data[fieldName] = ''
            }
            return data
        },
        submit() {
            this.$emit('submitted', this.data)
        },
        makeProtectedFields(fieldName, options) {
            if (options.type === 'password')
                this.protectedFields[fieldName] = true
        },
        setupFormOptions() {
            for (let [fieldName, options] of Object.entries(this.structure)) {
                this.makeProtectedFields(fieldName, options)
            }
            this.formIsSetup = true
        },
        extensionSupport(extension, $event) {
            this.data[extension] = $event
        },
        needsValidation(type) {
            const typesNeedValidation = ["number", "password"]
            return !!typesNeedValidation.find(needValidation => needValidation === type)
        },
        minLength(data, min) {
            return data.length >= min
        },
        max(data, max) {
            return data <= max
        },
        min(data, min) {
            return data >= min
        },
        specialValidation(data, validationName) {
            return true
            //return this[validationName](data)
        }
    },
    computed: {
        needToBeValidatedFields() {
            const needsValidation = {}
            for (let [fieldName, options] of Object.entries(this.structure)) {
                if (!options.type || this.needsValidation(options.type))
                    needsValidation[fieldName] = options
            }
            return needsValidation
        },
        compiledValidations() {
            const compiled = {}
            for (let [fieldName, options] of Object.entries(this.needToBeValidatedFields)) {
                compiled[fieldName] = {}
                if (options.validation) {
                    compiled[fieldName].specialValidation = options.validation
                    continue
                }
                if (!options.type && !options.minLength) {
                    compiled[fieldName].minLength = 1
                    continue
                }
                else if (options.minLength)
                    compiled[fieldName].minLength = options.minLength
                if (options.type === 'number' && options.min) 
                    compiled[fieldName].min = options.min
                if (options.type === "number" && options.max)
                    compiled[fieldName].max = options.max
            }
            return compiled
        },
        validateFields() {
            const valid = {}
            for (let [fieldName, validations] of Object.entries(this.compiledValidations)) {
                let passed = true
                for (let [validationName, validationVal] of Object.entries(validations)) {
                    const target = this.data[fieldName]
                    if (!this[validationName](target, validationVal)) {
                        passed = false
                        break
                    }
                }
                valid[fieldName] = passed
            }
            return valid
        },
        allFieldsValid() {
            for (let [fieldName, isValid] of Object.entries(this.validateFields)) {
                if (!isValid)
                    return false
            }
            return true
        },
        validSubmission() {
            return !equal(this.data, this.originalData) && this.allFieldsValid
        }
    },
    created() {
        if (this.basedOn)
            this.setData(this.basedOn)
        else
            this.setData(this.createDataBasedOnStructure())
        this.setupFormOptions()       
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
            $opacityLeft: 0.3,
            $name: '#{$colorName}-#{$rightColor}' ,
            $colorRight: $rightColor,
            $opacityRight: $opacityValue
        );
    }
};

button {
    margin-top: 4vh;
}

.formLabel {
    margin-top: 2.5vh;
    margin-bottom: 1.5vh;
    font-weight: 500;
    font-size: 2.3vh;
}

.formContainer {
    margin-top: 2vh;
}

.protected {
    margin-top: 1vh
}

.errorMsg {
    color: red;
    font-size: 2vh;
}

.formTitle {
    font-size: 4vh;
    font-weight: 800;
}

.invalidFeedback {
    margin-top: 1.3vh;
    color: red;
    font-size: 1.5vh;
}

</style>
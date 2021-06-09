<template>
    <div v-if="showForm">

        <div 
             v-if="data"
            :class="`
                ${backgroundColor}-form 
                ${ backgroundColor === 'none' ? '' : 'box-shadow'} 
                formContainer 
                ${textColor}-text
                `" 
        >
            
            <div v-if="formTitle" class="formTitle">
                {{ formTitle }}
            </div>

            <div v-for="(fieldData, fieldName) in structureCopy" :key="fieldName">
                
                <div class="form-label" :for="fieldName">
                    {{  fieldData.alias || _utils.stringFormat(fieldName) }}
                </div>

                <div v-if="extensibleType(readOnly ? 'readOnly' : fieldData.type)">
                    <component 
                        :is="readOnly ? 'readOnlyExt' : fieldData.type + `Ext`"
                        :name="fieldName"
                        :options="fieldData"
                        :defaultValidators="{
                            minLength
                        }"
                        @changed="extensionInterface(fieldName, $event)"
                    />
                </div>

                <div v-else-if="!fieldData.type">
                    <default-extension
                        @changed="extensionInterface(fieldName, $event)"
                        :name="fieldName"
                        :options="fieldData"
                        :validators="passValidator(fieldData, fieldName)"
                    />
                </div>

                <div 
                    v-if="fieldNeedsValidationAndIsInvalid(fieldName) && showInvalidationMsgs"
                >
                    <div
                        v-for="(feedback, feedbackNo) in invalidFeedback(fieldName)"
                        :key="feedbackNo"
                        class="invalidFeedback"
                    >
                        ❌ {{ feedback }}
                    </div>
                </div>

                <div v-if="bindedExtSupported(fieldName)">
                    <transition :name="initalDisplay ? `none` : `dropdown`">
                        
                        <component 
                            :is="`${bindedExtName(fieldName)}Ext`"
                            :bindedTo="data[bindedExtBindedTo(fieldName)]"
                            :defaultValidators="{
                                minLength
                            }"
                            :bindedName="bindedExtBindedTo(fieldName)"
                            @changed="extensionInterface(bindedExtName(fieldName).slice(0, -1), $event)"
                        >
                            <template #default>
                                <div class="form-label">
                                    {{ _utils.stringFormat(bindedExtName(fieldName)).slice(0, -1) }}
                                </div>
                            </template>
                            <template #invalidMsgs>
                                <div 
                                    v-if="fieldNeedsValidationAndIsInvalid(bindedExtName(fieldName).slice(0, -1)) && showInvalidationMsgs"
                                >
                                    <div
                                        v-for="(feedback, feedbackNo) in invalidFeedback(bindedExtName(fieldName).slice(0, -1))"
                                        :key="feedbackNo"
                                        class="invalidFeedback"
                                    >
                                        ❌ {{ feedback }}
                                    </div>
                                </div>
                            </template>
                        </component>

                    </transition>
                </div>
            </div>

            <button
                v-if="!readOnly"
                :style="`margin-top: ${showInvalidationMsgs ? 7 : 3}%;`" 
                :class="buttonColor" 
                :disabled="!validSubmission"
                @click="submit()"
            >
                {{ buttonText }}
            </button>

            <slot></slot>

            <div v-if="errorMsg" class="errorMsg">
                {{ errorMsg }}
            </div>

        </div>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

import defaultExtension from './extensions/free/defaultExt.vue'
import extsList from './extsList.json'
import validators from '@/libraries/formValidation/main.js'

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
            default: 'silver'
        },
        backgroundColor: {
            type: String,
            required: false,
            default: 'dark-blue'
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
        bindedExts: {
            type: Array,
            required: false,
            default: () => []
        },
        showInvalidationMsgs: {
            type: Boolean,
            required: false,
            default: true
        },
        confirmBeforeSubmit: {
            type: Boolean,
            required: false,
            default: true
        },
        readOnly: {
            type: Boolean,
            required: false,
            default: false
        },
        rerenderOnBasedOnUpdate: {
            type: Boolean,
            required: false,
            default: true
        },
        disableIfSameAsStart: {
            type: Boolean,
            required: false,
            default: true
        },
        textColor: {
            type: String,
            required: false,
            default: "black"
        }
    },
    components: {
        'statesExt': () => import('./extensions/binded/statesExt.vue'),
        "confirmsExt": () => import('./extensions/binded/confirmExt.vue'),
        "dropdownExt": () => import('./extensions/primitives/dropdown.vue'),
        "protectedExt": () => import('./extensions/free/protectedExt.vue'),
        "textAreaExt": () => import('./extensions/primitives/textArea.vue'),
        "checkboxExt": () => import('./extensions/free/checkbox.vue'),
        "readOnlyExt": () => import('./extensions/primitives/readOnly.vue'),
        "timingMutatorExt": () => import('./extensions/primitives/timingMutator.vue'),
        defaultExtension
    },
    data() {
        return {
            data: {},
            originalData: null,
            extsList,
            validations: {},
            structureCopy: null,
            initalDisplay: true,
            showForm: true
        }
    },
    methods: {
        fieldNeedsValidationAndIsInvalid(fieldName) {
            if (typeof this.validations[fieldName] !== 'undefined') {
                return !this.validations[fieldName].state
            }
        },
        passValidator(options, fieldName) {
            let validationList = [
                {
                    name: 'minLength',
                    min: options.minLength ? options.minLength : 1
                }
            ]
            if (options.validators) {
                validationList = options.validators
            }
            return async (data) => {
                const validationRes = await validators.getValidators(validationList, data, fieldName)
                return validationRes
            }
        },
        extensibleType(type) {
            return !!this.extsList.freeExts.find(extType => extType === type)
        },
        findBindedExt(bindedTo) {
            return this.extsList.bindedExts.find(bindedExts => bindedExts.bindedTo === bindedTo)
        },
        bindedExtName(fieldName) {
            const found = this.findBindedExt(fieldName)
            return found.name
        },
        bindedExtSupported(fieldName) {
            const found = this.findBindedExt(fieldName)
            if (found)
                return !!this.bindedExts.find(ext => ext === found.name)
            else
                return false
        },
        bindedExtBindedTo(fieldName) {
            const found = this.findBindedExt(fieldName)
            return found.bindedTo
        },
        invalidFeedback(fieldName) {
            if (this.structureCopy[fieldName] && this.structureCopy[fieldName].invalidMsg)
                return [this.structureCopy[fieldName].invalidMsg]
            else if (this.validations[fieldName])
                return this.validations[fieldName].msgs
            else
                return `Invalid ${this._utils.stringFormat(fieldName)}`
        },
        setData(inputData) {
            this.data = this._utils.deepCopy(inputData)
            this.originalData = this._utils.deepCopy(inputData)
        },
        async submit() {
            if (this.confirmBeforeSubmit) {
                const confirm = await this._utils.confirm(`Are you sure you want to submit?`)
                if (confirm)
                    this.$emit('submitted', this.data)
            } else
                this.$emit('submitted', this.data)
        },
        extensionInterface(extension, $event) {
            if ($event.val !== undefined)
                this.$set(this.data, extension, $event.val)
            if ($event.created)
                this.setData(this.data)
            if ($event.deleted) {
                delete this.data[extension]
                delete this.originalData[extension]
            }
            const fieldNeedsValidation = $event.state !== undefined
            if (fieldNeedsValidation) {
                if (!this.validations[extension])
                        this.$set(this.validations, extension, {})
                for (let [exetensionInfoField, info] of Object.entries($event)) {
                    this.$set(this.validations[extension], exetensionInfoField, info)
                }
            }
        },
        needsValidation(type) {
            const typesNeedValidation = ["number", "password"]
            return !!typesNeedValidation.find(needValidation => needValidation === type)
        },
        minLength(data, min=0) {
            return data.length >= min
        },
        fillDefaultsWithBasedOn(basedOn) {
            const copy = this._utils.deepCopy(basedOn)
            // eslint-disable-next-line no-unused-vars
            for (let [fieldName, _] of Object.entries(this.structureCopy)) {
                this.structureCopy[fieldName].default = copy[fieldName]
            }
        }
    },
    computed: {
        allFieldsValid() {
            if (!this.validations)
                return false
            // eslint-disable-next-line no-unused-vars
            for (let [_, validationInfo] of Object.entries(this.validations)) {  
                if (!validationInfo.state)
                    return false
            }
            return true
        },
        sameAsOriginal() {
            if (this.disableIfSameAsStart)
                return equal(this.data, this.originalData)
            else
                return false
        },
        validSubmission() {
            return !this.sameAsOriginal && this.allFieldsValid
        }
    },
    watch: {
        basedOn() {
            if (this.rerenderOnBasedOnUpdate) {
                this.showForm = false
                this.$nextTick(() => { this.showForm = true })
            }
        }
    },
    created() {
        this.structureCopy = this._utils.deepCopy(this.structure)
        if (this.basedOn) {
            this.fillDefaultsWithBasedOn(this.basedOn)
            this.setData(this.basedOn)
        }
    },
    mounted() {
        this.$nextTick(() => {
            const twoHundredMilliSeconds = 200
            window.setTimeout(() => { this.initalDisplay = false  }, twoHundredMilliSeconds)
        })
    }
}
</script>

<style lang="scss" scoped>
button {
    width: 90%;
    padding-top: 10px;
    padding-bottom: 10px;
    color: black;
    font-size: 17px;
    @include floating-box-shadow(0.5);
}

.dark-blue-form {
    background: get-color("dark-blue", 0.5);
}

.red-form {
    background: get-color("red", 0.5);
}

.yellow-form {
    background: get-color("yellow", 0.5);
}

.formContainer {
    margin-top: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    @include normal-border-rounding();
    width: 80%;
    max-width: 500px;
    @include center-margin();
    color: black;

    &.off-white-text {
        color: get-color("off-white") !important;
    }
}

.box-shadow {
    @include floating-box-shadow();
}

.form-label {
    text-align: left;
    margin-top: 20px;
    @include center-margin();
    font-size: 18px;
    width: 90%;
}

.errorMsg {
    margin-top: 10px;
    color: get-color("yellow");
    font-size: 17px;
    width: 80%;
    @include center-margin();
}

.formTitle {
    font-size: 40px;
    font-weight: 800;
}

.invalidFeedback {
    margin-top: 12px;
    color: red;
    font-size: 13px;
    width: 80%;
    @include center-margin();
}

@media screen and (max-width: $phone-width) {

    .form-label {
        font-size: 14px;
    }

    .formTitle {
        font-size: 28px;
    }

    .invalidFeedback {
        font-size: 11px;
    }

    .errorMsg {
        font-size: 13px;
    }

    button {
        font-size: 14px;
    }
}

</style>
<template>
    <div v-if="showForm">
        <div :class="`${backgroundColor} ${ backgroundColor === 'none' ? '' : 'box-shadow'} formContainer`" v-if="data">
            
            <div v-if="formTitle" class="formTitle">
                {{ formTitle }}
            </div>

            <div v-for="(fieldData, fieldName) in structureCopy" :key="fieldName">
                
                <div class="formLabel" :for="fieldName">
                    {{  fieldData.alias || utils.stringFormat(fieldName) }}
                </div>

                <tag-box
                    v-if="fieldData.tag && fieldData.tag === 'encrypted'"
                    class="tag-box"
                    :info="{
                            words: 'Fully-Encrypted',
                            color: 'goodNews',
                            symbol: '⚔️'
                    }"
                />

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
                                <div class="formLabel">
                                    {{ utils.stringFormat(bindedExtName(fieldName)).slice(0, -1) }}
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
            default: 'darkBlue'
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
        }
    },
    components: {
        'statesExt': () => import('./extensions/binded/statesExt.vue'),
        "confirmsExt": () => import('./extensions/binded/confirmExt.vue'),
        "phoneNumberExt": () => import('./extensions/free/phoneNumberExt.vue'),
        "dropdownExt": () => import('./extensions/primitives/dropdown.vue'),
        "protectedExt": () => import('./extensions/free/protectedExt.vue'),
        "textAreaExt": () => import('./extensions/primitives/textArea.vue'),
        "checkboxExt": () => import('./extensions/free/checkbox.vue'),
        "readOnlyExt": () => import('./extensions/primitives/readOnly.vue'),
        "tagBox": () => import('@/components/general/tagBox.vue'),
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
                return `Invalid ${this.utils.stringFormat(fieldName)}`
        },
        setData(inputData) {
            this.data = this.utils.deepCopy(inputData)
            this.originalData = this.utils.deepCopy(inputData)
        },
        async submit() {
            if (this.confirmBeforeSubmit) {
                const confirm = await this.utils.confirm(`Are you sure you want to submit?`)
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
            const copy = this.utils.deepCopy(basedOn)
            for (let [fieldName, currentVal] of Object.entries(this.structureCopy)) {
                this.structureCopy[fieldName].default = copy[fieldName]
            }
        }
    },
    computed: {
        allFieldsValid() {
            if (!this.validations)
                return false
            for (let [fieldName, validationInfo] of Object.entries(this.validations)) {
                if (!validationInfo.state)
                    return false
            }
            return true
        },
        sameAsOriginal() {
            return equal(this.data, this.originalData)
        },
        validSubmission() {
            return !this.sameAsOriginal && this.allFieldsValid
        }
    },
    watch: {
        basedOn() {
            // rerender form
            this.showForm = false
            this.$nextTick(() => { this.showForm = true })
        }
    },
    created() {
        this.structureCopy = this.utils.deepCopy(this.structure)
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
    color: black;
    font-size: 1.8vh;
}

.tag-box {
    width: 89%;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    margin-top: 15px;
    margin-bottom: 15px;
}

@media screen and (max-width: $phoneWidth) {
    .tag-box {
        margin-top: 1vh;
        margin-bottom: 1.5vh;
    }
}

.darkBlue {
    background: themeRGBA("darkBlue", 0.5);
}

.red {
    background: themeRGBA("red", 0.5);
}

.yellow {
    background: themeRGBA("yellow", 0.5);
}

.formContainer {
    margin-top: 4vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    border-radius: 7px;
    width: 80%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    z-index: 0;
    position: relative;
}

.box-shadow {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.formLabel {
    text-align: left;
    margin-top: 2.5vh;
    margin-left: auto;
    margin-right: auto;
    font-weight: 500;
    font-size: 1.9vh;
    color: black;
    width: 90%;
}

.errorMsg {
    color: getColor("yellow");
    font-size: 2vh;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.formTitle {
    font-size: 4vh;
    font-weight: 800;
}

.invalidFeedback {
    margin-top: 1.3vh;
    color: red;
    font-size: 1.5vh;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

</style>
<template>
    <div>
        <div :class="`${backgroundColor} ${ backgroundColor === 'none' ? '' : 'box-shadow'} formContainer`" v-if="data">
            <div v-if="formTitle" class="formTitle">
                {{ formTitle }}
            </div>
            <div v-for="(fieldData, fieldName) in structureCopy" :key="fieldName">
                <div class="formLabel" :for="fieldName">
                    {{  fieldData.alias || _.stringFormat(fieldName) }}
                </div>
                <div v-if="extensibleType(fieldData.type)">
                    <component 
                        :is="fieldData.type + `Ext`"
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
                        :defaultValidators="{
                            minLength
                        }"
                    />
                </div>
                <div 
                    v-if="fieldNeedsValidationAndIsInvalid(fieldName) && showInvalidationMsgs"
                    class="invalidFeedback"
                >
                    ❌ {{ invalidFeedback(fieldName) }}
                </div>
                <div v-if="bindedExtSupported(fieldName)">
                    <transition name="dropdown">
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
                                    {{ _.stringFormat(bindedExtName(fieldName)).slice(0, -1) }}
                                </div>
                            </template>
                            <template #invalidMsgs>
                                <div 
                                    v-if="fieldNeedsValidationAndIsInvalid(bindedExtName(fieldName).slice(0, -1)) && showInvalidationMsgs"
                                    class="invalidFeedback"
                                >
                                    ❌ {{ invalidFeedback(bindedExtName(fieldName).slice(0, -1)) }}
                                </div>
                            </template>
                        </component>
                    </transition>
                </div>
            </div>
            <button
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
        }
    },
    components: {
        'statesExt': () => import('./extensions/binded/statesExt.vue'),
        "confirmsExt": () => import('./extensions/binded/confirmExt.vue'),
        "phoneNumberExt": () => import('./extensions/free/phoneNumberExt.vue'),
        "dropdownExt": () => import('./extensions/primitives/dropdown.vue'),
        "protectedExt": () => import('./extensions/free/protectedExt.vue'),
        "handleExt": () => import('./extensions/free/handleExt.vue'),
        "textAreaExt": () => import('./extensions/primitives/textArea.vue'),
        "checkboxExt": () => import('./extensions/free/checkbox.vue'),
        "readOnlyExt": () => import('./extensions/primitives/readOnly.vue'),
        defaultExtension
    },
    data() {
        return {
            data: {},
            originalData: null,
            extsList,
            validations: {},
            structureCopy: null
        }
    },
    methods: {
        fieldNeedsValidationAndIsInvalid(fieldName) {
            if (typeof this.validations[fieldName] !== 'undefined') {
                return !this.validations[fieldName].state
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
                return this.structureCopy[fieldName].invalidMsg
            else if (this.validations[fieldName])
                return this.validations[fieldName].msgs.reduce((total, msg) => `${total}\n❌ ${msg}`)
            else
                return `Invalid ${this._.stringFormat(fieldName)}`
        },
        setData(inputData) {
            this.data = this._.deepCopy(inputData)
            this.originalData = this._.deepCopy(inputData)
        },
        submit() {
            this.$emit('submitted', this.data)
        },
        extensionInterface(extension, $event) {
            if (typeof $event.val !== "undefined")
                this.$set(this.data, extension, $event.val)
            if ($event.created) {
                this.setData(this.data)
            }
            if ($event.deleted) {
                delete this.data[extension]
                this.setData(this.data)
            }
            const fieldNeedsValidation = typeof $event.state !== 'undefined'
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
            const copy = this._.deepCopy(basedOn)
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
    created() {
        this.structureCopy = this._.deepCopy(this.structure)
        if (this.basedOn) {
            this.fillDefaultsWithBasedOn(this.basedOn)
            this.setData(this.basedOn)
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    width: 90%;
    color: black;
    font-size: 1.8vh;
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
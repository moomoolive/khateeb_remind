<template>
    <div :class="`gradient${backgroundColor} formContainer`" v-if="data">
        <div v-if="formTitle" class="formTitle">
            {{ formTitle }}
        </div>
        <div v-for="(fieldData, fieldName) in structure" :key="fieldName">
            <div class="formLabel" :for="fieldName">
                {{ _.stringFormat(fieldName) }}
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
        "dropdownExt": () => import('./extensions/free/dropdownExt.vue'),
        "protectedExt": () => import('./extensions/free/protectedExt.vue'),
        "handleExt": () => import('./extensions/free/handleExt.vue'),
        "textAreaExt": () => import('./extensions/free/textAreaExt.vue'),
        "checkboxExt": () => import('./extensions/free/checkbox.vue'),
        defaultExtension
    },
    data() {
        return {
            data: null,
            originalData: null,
            extsList,
            validations: {}
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
            if (this.structure[fieldName] && this.structure[fieldName].invalidMsg)
                return this.structure[fieldName].invalidMsg
            else if (this.validations[fieldName])
                return this.validations[fieldName].msgs.reduce((total, msg) => `${total}\n❌ ${msg}`)
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
                data[fieldName] = ''
            }
            return data
        },
        submit() {
            this.$emit('submitted', this.data)
        },
        extensionInterface(extension, $event) {
            if (typeof $event.val !== "undefined")
                this.$set(this.data, extension, $event.val)
            if ($event.created)
                this.setData(this.data)
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
        max(data, max) {
            return data <= max
        },
        min(data, min) {
            return data >= min
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
        if (this.basedOn)
            this.setData(this.basedOn)
        else
            this.setData(this.createDataBasedOnStructure())
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
    margin-top: 3%;
    width: 35.5vh;
}

.formLabel {
    margin-left: 2vh;
    margin-bottom: 0.5vh;
    text-align: left;
    margin-top: 2.5vh;
    font-weight: 500;
    font-size: 1.9vh;
    opacity: 1;
    color: black;
}

.formContainer {
    margin-top: 2vh;
    padding-top: 0.8vh;
    padding-bottom: 0.8vh;
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
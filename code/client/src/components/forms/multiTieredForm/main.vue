<template>
    <div>
        <progress-tracker 
            :totalSteps="totalSteps"
            :currentStep="currentStep"
            :stepNames="stepNamesList"
        />
        <div v-for="(template, templateIndex) in formTemplateInfo" :key="templateIndex">
            <component
                v-show="templateIndex + 1 === currentStep" 
                :is="template.templateName"
                v-bind="adjustTemplateProps(templateIndex, template)"
                @submitted="depositInformation($event, template.alias || template.templateName)"
            />
        </div>
        <transition name="dropdown">
            <button 
                v-show="currentStep !== 1 && !isFinalStep" 
                :class="buttonColor" 
                @click="changeStep(-1)"
            >
                {{ backOneStepButtonText }}
            </button>
        </transition>
    </div>
</template>

<script>
import progressTracker from '@/components/general/progressTracker.vue'

export default {
    name: "multiTieredForm",
    components: {
        progressTracker,
        "user": () => import('@/components/forms/templates/user.vue'),
        "institution": () => import('@/components/forms/templates/institution.vue')
    },
    props: {
        formTemplateInfo: {
            type: Array,
            required: true
        },
        backOneStepButtonText: {
            type: String,
            required: false,
            default: 'To Previous Step'
        },
        stepNames: {
            type: Array,
            required: false,
            default: () => []
        },
        buttonColor: {
            type: String,
            required: false,
            default: 'purple'
        }
    },
    data() {
        return {
            currentStep: 1,
            formData: {}
        }
    },
    methods: {
        adjustTemplateProps(index, template) {
            let updated = { ...template }
            delete updated.templateName
            if (index === this.formTemplateInfo.length - 1)
                updated = { ...updated, confirmBeforeSubmit: false }
            return updated
        },
        changeStep(increment) {
            this.currentStep += increment
        },
        defaultStepNames() {
            const names = []
            for (let i = 0; i < this.formTemplateInfo.length; i++)
                names.push(`Step\n${i + 1}`)
            return names
        },
        depositInformation(formInfo, keyName) {
            this.formData[keyName] = formInfo
            this.changeStep(1)
            if (this.isFinalStep)
                this.emitAllInfo()
                
        },
        emitAllInfo() {
            this.$emit('submitted', this.formData)
        }
    },
    computed: {
        totalSteps() {
            return this.formTemplateInfo.length + 1
        },
        isFinalStep() {
            return this.currentStep === this.totalSteps 
        },
        stepNamesList() {
            if (this.stepNames.length === this.formTemplateInfo.length || this.stepNames.length === this.formTemplateInfo.length + 1)
                return this.stepNames
            else
                return this.defaultStepNames()
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    margin-top: 20px;
    max-width: 200px;
    max-height: 50px;
    font-size: 13px;
}
</style>
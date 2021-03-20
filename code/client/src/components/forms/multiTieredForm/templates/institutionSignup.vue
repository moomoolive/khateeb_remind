<template>
    <div>
        <multi-tiered-form 
            :stepNames="['Register\nInst', 'Register\nAdmin', 'Wait\nfor\nresponse']"
            :formTemplateInfo="formTemplateInfo"
            @submitted="$emit('submitted', $event)"
        />
    </div>
</template>

<script>
import multiTieredForm from '@/components/forms/multiTieredForm/main.vue'

export default {
    name: 'institutionSignupMultiTieredFormTemplate',
    components: {
        multiTieredForm
    },
    data() {
        return {
            formTemplateInfo: [
                {
                    templateName: 'institution',
                    formProps: {
                        bindedExts: ['states'],
                        backgroundColor: 'yellow',
                        buttonText: 'To Next Step',
                        confirmBeforeSubmit: false,
                        formTitle: 'Institution Details'
                    }
                },
                {
                    templateName: 'user',
                    alias: 'institutionAdmin',
                    userType: "rootInstitutionAdmin",
                    includeVitals: true,
                    formProps: {
                        bindedExts: ['confirms'],
                        backgroundColor: 'yellow',
                        buttonText: 'Sign up',
                        formTitle: 'Institution Admin'
                    }
                }
            ]
        }
    }
}
</script>

<style>

</style>
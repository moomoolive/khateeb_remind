<template>
    <div>
        <loading>
            <progress-tracker 
                :totalSteps="totalSteps"
                :currentStep="currentStep"
                :stepNames="['Register\nInst', 'Register\nAdmin', 'Wait\nfor\nresponse']"
            />
            <institution-form-template 
                v-show="showInstitutions"
                :formProps="{
                    bindedExts: ['states'],
                    backgroundColor: 'yellow',
                    buttonText: 'To Next Step',
                    confirmBeforeSubmit: false,
                    formTitle: 'Institution Details'
                }"
                @submitted="toStepTwo('institution', $event)"
            />
            <user-form-template 
                v-show="showInstitutionAdmin"
                :userType="`rootInstitutionAdmin`"
                :includeVitals="true"
                :formProps="{
                    bindedExts: ['confirms'],
                    backgroundColor: 'yellow',
                    buttonText: 'Sign up',
                    formTitle: 'Institution Admin'
                }"
                @submitted="toAPI('institutionAdmin', $event)"
            />
            <transition name="dropdown">
                <button v-show="currentStep !== 1" @click="changeStep(-1)">
                    To Previous Step
                </button>
            </transition>
        </loading>
    </div>
</template>

<script>
import progressTracker from '@/components/general/progressTracker.vue'
import loading from '@/components/general/loadingScreen.vue'
import institutionFormTemplate from '@/components/forms/templates/institution.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'

export default {
    name: "institutionSignUp",
    components: {
        progressTracker,
        loading,
        institutionFormTemplate,
        userFormTemplate
    },
    data() {
        return {
            showInstitutions: true,
            showInstitutionAdmin: false,
            request: {
                institution: null,
                institutionAdmin: null
            },
            totalSteps: 3,
            currentStep: 1
        }
    },
    methods: {
        deposit(requestSection, $event) {
            this.request[requestSection] = $event
        },
        changeStep(val) {
            if (val === -1) {
                this.showInstitutionAdmin = false
                this.showInstitutions = true
            }
            this.currentStep = this.currentStep + val
        },
        toStepTwo(requestSection, $event) {
            this.showInstitutions = false
            this.changeStep(1)
            this.showInstitutionAdmin = true
            this.deposit(requestSection, $event)
        },
        async toAPI(requestSection, $event) {
            try {
                this.changeStep(1)
                this.deposit(requestSection, $event)
                const res = await this.$API.auth.createInstitution(this.request)
                if (typeof res.status !== "undefined" && res.status === 'reserved')
                    return this.utils.alert(res.msg)
                this.utils.alert(res, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        },
    },
    computed: {
        firstStep() {
            return this.currentStep === 1
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    margin-top: 4vh;
}

.msgContainer {
    width: 80%;
    margin-top: 8vh;
    margin-left: auto;
    margin-right: auto;
}

h1 {
    font-size: 3.5vh;
}

</style>
<template>
    <div>
        <loading>
            <progress-tracker 
                :totalSteps="totalSteps"
                :currentStep="currentStep"
                :stepNames="['Register\nInst', 'Register\nAdmin', 'Wait\nfor\nresponse']"
            />
            <formMain
                v-show="showInstitutions"
                :structure="formStructure.institution"
                :bindedExts="['states']"
                :backgroundColor="`yellow`"
                :buttonText="`To Next Step`"
                :confirmBeforeSubmit="false"
                @submitted="toStepTwo('institution', $event)"
                :formTitle="`Institution Details`"
            />
            <formMain
                v-show="showInstitutionAdmin"
                :structure="formStructure.institutionAdmin"
                :bindedExts="['confirms']"
                :backgroundColor="`yellow`"
                :buttonText="`Sign Up`"
                @submitted="toAPI('institutionAdmin', $event)"
                :formTitle="`Institution Admin`"
            />
            <button
                :disabled="firstStep"
                @click="changeStep(-1)"
            >
                To Previous Step
            </button><br>
        </loading>
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'
import progressTracker from '@/components/userInterface/components/progressTracker.vue'
import loading from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: "institutionSignUp",
    components: {
        formMain,
        progressTracker,
        loading
    },
    data() {
        return {
            showInstitutions: true,
            showInstitutionAdmin: false,
            formStructure: {
                institution: {
                    name: {
                        required: true
                    },
                    abbreviatedName: {
                        required: true
                    },
                    timezone: {
                        type: "dropdown",
                        required: true,
                        selectOptions: ["America/Edmonton", "America/Vancouver"]
                    },
                    country: {
                        type: "dropdown",
                        required: true,
                        selectOptions: ["Canada", "United States", "Mexico"]
                    }  
                },
                institutionAdmin: {
                    username: {
                        required: true,
                        validators: 'username'
                    },
                    password: {
                        required: true,
                        minLength: 6
                    },
                    handle: {
                        validators: 'handle',
                        required: true,
                    },
                    firstName: {
                        required: true
                    },
                    lastName: {
                        required: true
                    },
                    phoneNumber: {
                        type: 'phoneNumber',
                        required: true
                    }
                }
            },
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
                this._.alert(res, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        }
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
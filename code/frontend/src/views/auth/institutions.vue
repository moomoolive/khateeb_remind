<template>
    <div>
        <progress-tracker 
            :totalSteps="totalSteps"
            :currentStep="currentStep"
            :stepNames="['Register\nInst', 'Register\nAdmin', 'Wait\nfor\nresponse']"
        />
        <div v-show="finished" class="msgContainer">
            <h1>
                Success!<br><br>
                blahjlakfasf lfajl;dfkjf asdfl  afld fslkja fldjf saf asl flkklsad fas
                {{ apiResponse }}
            </h1>
        </div>
        <div v-show="!finished">
            <formMain
                v-show="showInstitutions"
                :structure="formStructure.institution"
                :bindedExts="['states']"
                @submitted="toStepTwo('institution', $event)"
                :formTitle="`Institution Details`"
            />
            <formMain
                v-show="showInstitutionAdmin"
                :structure="formStructure.institutionAdmin"
                :bindedExts="['confirms']"
                @submitted="toAPI('institutionAdmin', $event)"
                :formTitle="`Institution Admin`"
            />
            <button
                :disabled="firstStep"
                @click="changeStep(-1)"
            >
                To Previous Step
            </button><br>
        </div>
        <button 
            class="red" 
            @click="toLogin()"
        >
            Back to Login
        </button>
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'
import progressTracker from '@/components/userInterface/components/progressTracker.vue'

export default {
    name: "institutionSignUp",
    components: {
        formMain,
        progressTracker
    },
    data() {
        return {
            showInstitutions: true,
            showInstitutionAdmin: false,
            finished: true,
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
                        minLength: 6
                    },
                    password: {
                        type: 'protected',
                        required: true,
                        minLength: 6
                    },
                    handle: {
                        type: 'handle',
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
            currentStep: 1,
            apiResponse: null
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
        toLogin() {
            if (!this.finished && window.confirm('Are you sure you want to go back to login? All progress current progress will be lost')) {
                this.$router.push('/')
            } else
                this.$router.push('/')
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
                this.apiResponse = await this.$API.auth.createInstitution(this.request)
                this.finished = true
                console.log(this.apiResponse)
            } catch(err) {
                console.log(err)
                alert(`There was a problem registering your institution`)
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
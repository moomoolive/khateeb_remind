<template>
    <div>
        <button @click="$router.push('/')">Back to Login</button>
        <formMain
            v-if="showInstitutions"
            :structure="formStructure.institution"
            :bindedExts="['states']"
            @submitted="deposit('institution', $event)"
            :formTitle="`Institution Details`"
        />
        <formMain
            v-if="showInstitutionAdmin"
            :structure="formStructure.institutionAdmin"
            :bindedExts="['confirms']"
            @submitted="deposit('institutionAdmin', $event)"
            :formTitle="`Institution Admin`"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: "institutionSignUp",
    components: {
        formMain
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
            }
        }
    },
    methods: {
        deposit(requestSection, $event) {
            this.request[requestSection] = $event
        }
    }
}
</script>

<style>

</style>
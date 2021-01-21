<template>
    <div>
        <button @click="$router.push('/')">Back to Login</button>
        <formMain
            v-if="!request.institution"
            :structure="formStructure.institution"
            :extensions="['states']"
            @submitted="deposit('institution', $event)"
            :formTitle="`Institution Details`"
        />
        <!---
        <formMain
            :structure="formStructure.institutionAdmin"
            @submitted="deposit('institutionAdmin', $event)"
            :backgroundColor="`red-offWhite`"
            :formTitle="`Institution Admin`"
        /> -->
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
            formStructure: {
                institution: {
                    name: {
                        required: true,
                        minLength: 1
                    },
                    abbreviatedName: {
                        required: true,
                        minLength: 1
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
                        minLength: 1
                    },
                    password: {
                        type: 'password',
                        required: true,
                        minLength: 1
                    },
                    handle: {
                        required: true,
                        validation: 'handle'
                    },
                    firstName: {
                        required: true,
                        minLength: 1
                    },
                    lastName: {
                        required: true,
                        minLength: 1
                    },
                    phoneNumber: {
                        type: 'number',
                        required: true,
                        min: 100_000_0000
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
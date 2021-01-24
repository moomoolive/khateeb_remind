<template>
    <div>
        <loading>
            <button @click="toLogin()">To Login</button>
            <div v-if="finished && finishedMsg">
                <h1>
                    {{ finishedMsg }}
                </h1>
            </div>
            <form-main
                v-if="structure.institutionID.selectOptions && !finished && !finishedMsg"
                :structure="structure"
                :bindedExts="['confirms']"
                @submitted="signupKhateeb($event)"
                :formTitle="`Khateeb Sign Up`"
            />
        </loading>
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'
import loading from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: "khateebSignup",
    components: {
        formMain,
        loading
    },
    data() {
        return {
            structure: {
                institutionID: {
                    type: 'dropdown',
                    required: true,
                    selectOptions: null,
                    value: '_id',
                    display: "name"
                },
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
                },
                title: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ['none', 'Shiekh', 'Imam']
                }
            },
            finished: false,
            finishedMsg: null
        }
    },
    methods: {
        async signupKhateeb($event) {
            this.finishedMsg = await this.$API.auth.createKhateeb($event)
            this.finished = true
        },
        toLogin() {
            this.$router.push('/')
        }
    },
    async created() {
        this.structure.institutionID.selectOptions = await this.$API.auth.getAvailableInstitutions()
    }
}
</script>

<style>

</style>
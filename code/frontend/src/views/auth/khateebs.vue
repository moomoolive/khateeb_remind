<template>
    <div>
        <loading>
            <div v-if="finished && finishedMsg">
                <h1>
                    {{ finishedMsg }}
                </h1>
            </div>
            <form-main
                v-if="structure.institutionID.selectOptions && !finished && !finishedMsg"
                :structure="structure"
                :bindedExts="['confirms']"
                :backgroundColor="`red`"
                :buttonColor="`blue`"
                :buttonText="`Sign Up`"
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
                    display: "name",
                    alias: 'Institution'
                },
                username: {
                    required: true,
                    minLength: 6
                },
                password: {
                    required: true,
                    minLength: 6
                },
                handle: {
                    type: 'handle',
                    required: true,
                },
                title: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ['none', 'Shiekh', 'Imam']
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
            },
            finished: false,
            finishedMsg: null
        }
    },
    methods: {
        async signupKhateeb($event) {
            try {
                this.finishedMsg = await this.$API.auth.createKhateeb($event)
                this.finished = true
                this._.alert(this.finishedMsg)
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
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
<template>
    <div>
        <loading>
            <form-main
                v-if="structure.institutionID.selectOptions"
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
                    validators: 'username'
                },
                password: {
                    required: true,
                    minLength: 6
                },
                handle: {
                    required: true,
                    validators: 'handle'
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
            }
        }
    },
    methods: {
        async signupKhateeb($event) {
            try {
                const res = await this.$API.auth.createKhateeb($event)
                this._.alert(res, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        }
    },
    async created() {
        this.structure.institutionID.selectOptions = await this.$API.auth.getAvailableInstitutions()
    }
}
</script>

<style>

</style>
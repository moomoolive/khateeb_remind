<template>
    <div>
        <complex-key-binder 
            :targetKeyBinds="['t', 'Control', 'Alt']"
            @all-key-bindings-active="includeTestInstitutionInInstitutionsList()"
        />
        <loading>

            <user-form-template
                v-if="showForm && thereAreInstitutionsToSignupFor" 
                :userType="`khateeb`"
                :includeVitals="true"
                :includeIdAppender="true"
                :institutionIDs="filteredInstitutions"
                :formProps="{
                    bindedExts: ['confirms'],
                    backgroundColor: 'red',
                    buttonColor: 'blue',
                    buttonText: 'Sign up',
                    formTitle: 'Khateeb Sign Up'
                }"
                @submitted="signupKhateeb($event)"
            />

            <msg-with-pic 
                v-else
                :msg="`There was a problem finding institutions to sign up for...`"
                :gif="`sadCat`"
            /> 

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'
import complexKeyBinder from '@/components/misc/complexKeyBinder.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: "khateebSignup",
    components: {
        loading,
        userFormTemplate,
        complexKeyBinder,
        msgWithPic
    },
    data() {
        return {
            allInstitutions: [],
            showForm: true,
            showTestInstitution: false
        }
    },
    methods: {
        async signupKhateeb($event) {
            try {
                const res = await this.$API.auth.createKhateeb($event)
                this.utils.alert(res, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        },
        async getAllConfirmedInstitutions() {
            const data = await this.$API.misc.institutionSelection()
        },
        includeTestInstitutionInInstitutionsList() {
            this.showTestInstitution = true
            this.rerenderForm()
        },
        rerenderForm() {
            this.showForm = false
            this.$nextTick(() => this.showForm = true)
        }
    },
    computed: {
        filteredInstitutions() {
            if (this.showTestInstitution)
                return this.allInstitutions
            else
                return this.allInstitutions.filter(inst => inst.name !== "__TEST__")
        },
        thereAreInstitutionsToSignupFor() {
            return this.allInstitutions.length > 0
        }
    },
    created() {
        this.getAllConfirmedInstitutions()
    }
}
</script>

<style>

</style>
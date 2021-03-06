<template>
    <div>
        <complex-key-binder 
            :targetKeyBinds="['t', 'Control', 'Alt']"
            @all-key-bindings-active="includeTestInstitutionInInstitutionsList()"
        />
        <loading>
            <user-form-template
                v-if="showForm" 
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
        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'
import complexKeyBinder from '@/components/misc/complexKeyBinder.vue'

export default {
    name: "khateebSignup",
    components: {
        loading,
        userFormTemplate,
        complexKeyBinder
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
                this._.alert(res, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
        },
        async getAllConfirmedInstitutions() {
            try {
                const data = await this.$API.misc.institutionSelection()
                this.allInstitutions = data || []
            } catch(err) {
                console.log(err)
            }
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
        }
    },
    created() {
        this.getAllConfirmedInstitutions()
    }
}
</script>

<style>

</style>
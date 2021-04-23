<template>
    <div>
        <loading>

            <user-form-template
                v-if="targetInstitution" 
                :userType="`khateeb`"
                :includeVitals="true"
                :formProps="{
                    bindedExts: ['confirms'],
                    backgroundColor: 'red',
                    buttonColor: 'blue',
                    buttonText: 'Sign up',
                    formTitle
                }"
                @submitted="signupKhateeb($event)"
            />

            <msg-with-pic 
                v-else
                :msg="`There was a problem finding the institution you're signing up for...`"
                :gif="`twirlingPlane`"
            /> 

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: "khateebSignup",
    components: {
        loading,
        userFormTemplate,
        msgWithPic
    },
    data() {
        return {
            allInstitutions: [],
            selectedInstitution: "none"
        }
    },
    methods: {
        async signupKhateeb(info={}) {
            const { code, msg } = await this.$API.auth.createKhateeb({ ...info, institutionID: this.selectedInstitution})
            if (code !== 0)
                return this.utils.alert(msg)
            this.utils.alert(msg, 'success')
            return this.utils.toHomePage()
        },
        async getAllConfirmedInstitutions() {
            this.allInstitutions = await this.$API.misc.institutionSelection()
        },
    },
    computed: {
        targetInstitution() {
            return this.allInstitutions.find(i => i._id === this.selectedInstitution)
        },
        formTitle() {
            if (this.targetInstitution)
                return `Become a khateeb at ${this.targetInstitution.abbreviatedName}`
            else
                return 'Khateeb Sign Up' 
        }
    },
    created() {
        this.getAllConfirmedInstitutions()
        const institution = this.$route.query.institutionID
        if (!institution)
            return this.$router.push({ path: "/institution-selection" })
        else
            this.selectedInstitution = institution
    }
}
</script>

<style>

</style>
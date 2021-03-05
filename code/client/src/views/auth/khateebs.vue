<template>
    <div>
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

export default {
    name: "khateebSignup",
    components: {
        loading,
        userFormTemplate
    },
    data() {
        return {
            keyBinds__TEST__: {},
            allInstitutions: [],
            showForm: true,
            testKeyBind: false
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
        handleKeyboardEvents(target, type) {
            if (type === "keydown")
                this.keyBinds__TEST__[target] = true
            else if (type === "keyup")
                this.keyBinds__TEST__[target] = false
        },
        keyBinds($event) {
            const targetKeyBind = ["t", "Control", "Alt"]
            const found = targetKeyBind.find(key => key === $event.key)
            if (found)
                this.handleKeyboardEvents(found, $event.type)
            this.$nextTick(() => { 
                if (Object.keys(this.keyBinds__TEST__).length !== 3)
                    return
                for (const [key, pressed] of Object.entries(this.keyBinds__TEST__)) {
                    if (!pressed)
                        return
                }
                this.testKeyBind = true
                this.showForm = false
                this.$nextTick(() => { this.showForm = true })
             })
        }
    },
    computed: {
        filteredInstitutions() {
            return this.testKeyBind ? this.allInstitutions : this.allInstitutions.filter(inst => inst.name !== "__TEST__")
        }
    },
    async created() {
        window.addEventListener('keydown', this.keyBinds)
        window.addEventListener('keyup', this.keyBinds)
        this.allInstitutions = await this.$API.misc.institutionSelection()
    },
    destroyed() {
        window.addEventListener('keydown', this.keyBinds)
        window.addEventListener('keyup', this.keyBinds)
    }
}
</script>

<style>

</style>
<template>
    <div>
        <loading>
            <form-main
                v-if="showForm"
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
            },
            keyBinds__TEST__: {},
            allInstitutions: null,
            showForm: true
        }
    },
    methods: {
        async signupKhateeb($event) {
            try {
                const res = await this.$API.khateebs.post($event)
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
                this.structure.institutionID.selectOptions = this._.deepCopy(this.allInstitutions)
                this.showForm = false
                this.$nextTick(() => { this.showForm = true })
             })
        }
    },
    async created() {
        window.addEventListener('keydown', this.keyBinds)
        window.addEventListener('keyup', this.keyBinds)
        this.allInstitutions = await this.$API.auth.getAvailableInstitutions()
        this.structure.institutionID.selectOptions = this.allInstitutions.filter(inst => inst.name !== "__TEST__")
    },
    destroyed() {
        window.addEventListener('keydown', this.keyBinds)
        window.addEventListener('keyup', this.keyBinds)
    }
}
</script>

<style>

</style>
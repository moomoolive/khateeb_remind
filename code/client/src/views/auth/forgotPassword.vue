<template>
    <div>
        <div :class="`form-container ${ verificationSent ? 'stage-two-form' : '' }`">
            <form-main
                v-if="showForm" 
                :structure="formStructure"
                :backgroundColor="`yellow`"
                :showInvalidationMsgs="verificationSent"
                :confirmBeforeSubmit="false"
                :errorMsg="errorMsg"
                @submitted="verificationSent ? checkVerificationCode($event): sendVerification($event)"
            />
        </div>
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: 'passwordRecovery',
    components: {
        formMain
    },
    data() {
        return {
            username: 'moomoo',
            verificationSent: false,
            errorMsg: '',
            showForm: true
        }
    },
    methods: {
        async sendVerification({ username='moomoo' }) {
            const { msg, code } = await this._api.auth.sendVerificationCode(username)
            if (code !== 0) {
                return this._utils.alert(msg)
            }
            this.verificationSent = true
            this.username = username
            this._utils.alert(msg, 'success')
            return this.rerenderForm()
        },
        rerenderForm() {
            this.showForm = false
            this.$nextTick(() => this.showForm = true)
        },
        async checkVerificationCode({ code="1234565", newPassword="123445666" }) {
            const { msg, code: resCode } = await this._api.auth.verificationCodeCheck({ code, newPassword, username: this.username })
            if (resCode !== 0)
                return this._utils.alert(msg)
            this._utils.alert(msg, 'success')
            return this._utils.toHomePage()
        }
    },
    computed: {
        formStructure() {
            if (this.verificationSent)
                return {
                    code: {
                        required: true
                    },
                    newPassword: {
                        required: true,
                        minLength: 6
                    }
                }
            else
                return {
                    username: { 
                        required: true,
                        alias: `Enter Your Account's Username` 
                    }
                }
        }
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    position: relative;
    top: 23vh;
    margin-left: auto;
    margin-right: auto;
}

.stage-two-form {
    top: 15vh !important;
}
</style>
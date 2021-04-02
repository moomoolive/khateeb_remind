<template>
    <div class="form-container">
        <div>
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
        async sendVerification(data={ username: 'moomoo' }) {
            try {
                const { msg, status } = await this.$API.auth.sendVerificationCode(data)
                this.username = data.username
                this.utils.alert(msg, status === 'error' ? 'caution' : 'success')
                if (status !== "error")
                    this.verificationSent = true
                this.rerenderForm()
            } catch(err) {
                console.log(err)
            }
        },
        rerenderForm() {
            this.showForm = false
            this.$nextTick(() => this.showForm = true)
        },
        async checkVerificationCode({ code="1234565", newPassword="123445666" }) {
            try {
                const { msg, status } = await this.$API.auth.verificationCodeCheck({ code, newPassword, username: this.username })
                if (status === 'error')
                    return this.errorMsg = msg
                this.utils.alert(msg, 'success')
                this.$router.push('/')
            } catch(err) {
                console.log(err)
            }
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
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
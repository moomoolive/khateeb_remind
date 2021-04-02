<template>
    <div class="form-container">
        <div>
            <form-main 
                :structure="{
                    phoneNumber: { 
                        required: true,
                        type: 'phoneNumber',
                        alias: `Enter Your Account's Phone Number` 
                    }
                }"
                :buttonText="`Recover Username`"
                :backgroundColor="`darkBlue`"
                :showInvalidationMsgs="false"
                :confirmBeforeSubmit="false"
                @submitted="recoverUsername($event)"
            />
        </div>
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: 'usernameRecovery',
    components: {
        formMain
    },
    methods: {
        async recoverUsername(phoneNumber=100_000_0000) {
            try {
                const { msg, status } = await this.$API.auth.forgotUsername(phoneNumber)
                this.utils.alert(msg, status === 'error' ? 'caution' : 'success')
                if (status !== "error")
                    this.$router.push('/')
            } catch(err) {
                console.log(err)
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
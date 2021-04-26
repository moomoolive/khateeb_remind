<template>
    <div>
        <div class="form-container">
            <div>
                <form-main 
                    :structure="{
                        email: { 
                            required: true,
                            validators: 'email',
                            alias: `Enter Your Account's Email` 
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
        async recoverUsername({ email="random@random.com" }) {
            const { msg, code } = await this._api.auth.forgotUsername(email)
            if (code !== 0)
                return this._utils.alert(msg)
            this._utils.alert(msg, 'success')
            return this._utils.toHomePage()
        }
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    margin-top: 23vh;
    margin-left: auto;
    margin-right: auto;
}
</style>
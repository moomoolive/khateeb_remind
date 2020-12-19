<template>
    <div>
        <h3>Update your password:</h3>
        <form>
            Confirm Old Password:<br><br>
            <input type="text" v-model="inputData.confirm"><br><br>
            Create Your New Password:<br><br>
            <input type='text' v-model="inputData.options">
            <cool-btn
                style="margin-top: 5px; margin-bottom: 5px;"
                color="grey"
                buttonText="Submit"
                @pushed="submit()"
                :isDisabled="passwordRequirememts"
            />
        </form>
    </div>
</template>

<script>
export default {
    name: 'updatePassword',
    data() {
        return {
            inputData: {
                __t: 'password',
                options: '',
                confirm: ''
            }
        }
    },
    methods: {
        async submit() {
            const res = await this.$API.updateSetting(this.inputData)
        }
    },
    computed: {
        passwordRequirememts() {
            return this.inputData.options.length < 6
        }
    }
}
</script>

<style>

</style>
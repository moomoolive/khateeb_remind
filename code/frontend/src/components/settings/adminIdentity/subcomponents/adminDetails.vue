<template>
    <div style="padding-top: 20px; padding-bottom: 20px;">
        <div v-for="(field, name) in fields" :key="field">
            {{ _.parseCamelCase(name, 'title') }}:<br><br>
            <input type="text" v-model="inputData.options[name]"><br><br>
        </div>
        <div>
            Phone Number:<br><br>
            <input type="text" v-model="inputData.options.phoneNumber">
        </div>
        <cool-btn
            style="padding-top: 20px;"
            color="grey"
            buttonText="Submit"
            @pushed="submit()"
        />
    </div>
</template>

<script>
export default {
    name: 'adminDetails',
    data() {
        return {
            inputData: {
                name: 'adminProfile',
                options: {}
            }
        }
    },
    methods: {
        submit() {
            console.log('hi')
        }
    },
    computed: {
        fields() {
            if (this.inputData.options) {
                const x = this.inputData.options
                delete x.phoneNumber
                return x
            }
        }
    },
    async created() {
        const response = await this.$API.getSetting(this.inputData.name)
        if (response.previousEntries) {
            this.inputData = response.previousEntries
        } else this.inputData.options = response.emptySchema.options
    }
}
</script>

<style>

</style>
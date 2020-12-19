<template>
    <div style="padding-top: 20px; padding-bottom: 20px;">
        <div v-for="(field, name) in fields" :key="name">
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
                __t: 'adminProfile',
                options: {}
            }
        }
    },
    methods: {
        async submit() {
            console.log(this.inputData)
            const res = await this.$API.updateSetting(this.inputData)
        }
    },
    computed: {
        fields() {
            if (this.inputData.options) {
                const x = this._.deepCopy(this.inputData.options)
                delete x.phoneNumber
                return x
            }
        }
    },
    async created() {
        const response = await this.$API.getSetting(this.inputData.__t)
        console.log(response)
        if (response.previousEntries[0]) {
            this.inputData = response.previousEntries[0]
        } else this.inputData = response.emptySchema
    }
}
</script>

<style>

</style>
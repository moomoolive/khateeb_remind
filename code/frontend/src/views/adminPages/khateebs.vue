<template>
    <div>
        <h2>Khateebs</h2>
        <h4>{{ khateebName }}</h4>
        <div>
            <label for="khateebs">Choose a Khateeb to Edit or Create a new Khateeb:</label>
            <select id="khateebs" v-model="selectedKhateeb">
                <option
                v-for="(khateeb, ID) in khateebData" :key="ID"
                :value="ID"
                >
                    {{ khateeb.firstName }} {{ khateeb.lastName }}
                </option>
                <option value="New Khateeb">Create New Khateeb</option>
            </select>
        </div>
        <div v-for="(property, key) in inputData" :key="key">
            <label :for="key">{{ key }}: </label>
            <div>
                <input type="text" :id="key" v-model="inputData[key]">
            </div>
        </div>
        <button @click="submit">Submit</button>
    </div>
</template>

<script>
import API from '../../utils/apiCalls.js'

export default {
    name: 'khateebs',
    data() {
        return {
            khateebData: null,
            selectedKhateeb: 'New Khateeb',
            inputData: {
                firstName: null,
                lastName: null,
                phoneNumber: null,
                active: null,
                email: null,
                dropouts: null,
                comments: []
            }
        }
    },
    methods: {
        async submit() {
            await API.updateKhateeb(this.$store.state.JWT_TOKEN, this.selectedKhateeb, this.inputData)
        }
    },
    computed: {
        khateebName() {
            return this.selectedKhateeb === 'New Khateeb' ? this.selectedKhateeb : `${this.inputData.firstName} ${this.inputData.lastName}`
        }
    },
    watch: {
        selectedKhateeb(newValue) {
            if (this.selectedKhateeb === 'New Khateeb') {
                for (let property in this.inputData) {
                    if (property === 'comments') this.inputData[property] = []
                    else this.inputData[property] = null
                }
            } else {
                this.inputData = JSON.parse(JSON.stringify(this.khateebData[newValue]))
            }
        }
    },
    async created() {
        this.khateebData = await API.getKhateebs(this.$store.state.JWT_TOKEN)
    }
}
</script>

<style lang="scss" scoped>

</style>
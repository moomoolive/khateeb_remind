<template>
    <div>
        <h2>Khateebs</h2>
        <h4>{{ khateebName }}</h4>
        <button v-if="selectedKhateeb !== 'New Khateeb'" @click="deleteKhateeb()">
            Delete Khateeb
        </button>
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
        <div v-for="(property, key) in inputFieldsWithoutID" :key="key">
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
            khateebData: [],
            selectedKhateeb: 'New Khateeb',
            inputData: {
                _id: null,
                firstName: null,
                lastName: null,
                phoneNumber: null,
                active: null,
                email: null,
                dropouts: null,
                comments: [],
                savedOn: new Date(),
                __v: 0
            }
        }
    },
    methods: {
        async submit() {
            await API.updateKhateeb(this.inputData)
            this.resetForm()
        },
        async deleteKhateeb() {
            const payload = {
                action: 'delete',
                _id: this.inputData._id
            }
            await API.deleteKhateeb({ _id: this.inputData._id})
            this.resetForm()
        },
        resetForm() {
            this.selectedKhateeb = 'New Khateeb'
            for (let field in this.inputData) {
                if (field === 'comments') this.inputData[field] = []
                else if (field === 'savedOn') this.inputData[field] = new Date()
                else this.inputData[field] = null
            }
        }
    },
    computed: {
        khateebName() {
            return this.selectedKhateeb === 'New Khateeb' ? this.selectedKhateeb : `${this.inputData.firstName} ${this.inputData.lastName}`
        },
        inputFieldsWithoutID() {
            const x = JSON.parse(JSON.stringify(this.inputData))
            delete x._id
            delete x.__v
            delete x.savedOn
            return x
        },
    },
    watch: {
        selectedKhateeb(newValue) {
            if (this.selectedKhateeb === 'New Khateeb') {
                this.resetForm()
            } else {
                this.inputData = JSON.parse(JSON.stringify(this.khateebData[newValue]))
            }
        }
    },
    async created() {
        this.khateebData = await API.getKhateebs('yes')
    }
}
</script>

<style lang="scss" scoped>

</style>
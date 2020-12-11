<template>
    <div>
        <h2>Khateebs</h2>
        <h4>{{ khateebName }}</h4>
        <div>
            Choose a Khateeb to Edit or Create a new Khateeb:<br>
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
        <button v-if="selectedKhateeb !== 'New Khateeb'" @click="deleteKhateeb()">
            Delete Khateeb
        </button>
        <div v-for="(property, key) in textFields" :key="key">
            <label :for="key">{{ key }}: </label>
            <div>
                <input type="text" :id="key" v-model="inputData[key]">
            </div>
        </div>
        <div>
            active: <input type="checkbox" v-model="inputData.active">
        </div>
        <div>
            Dropouts: {{ inputData.dropouts }}
        </div>
        <button @click="submit" :disabled="notReadyToSubmit">
            Submit
        </button>
    </div>
</template>

<script>
export default {
    name: 'editKhateebs',
    data() {
        return {
            khateebData: [],
            selectedKhateeb: 'New Khateeb',
            inputData: {},
            emptyKhateeb: {
                _id: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                active: true,
                email: '',
                dropouts: '0',
                comments: [],
                savedOn: new Date(),
                __v: 0
            },
            isMounted: false
        }
    },
    methods: {
        async submit() {
            await this.$API.updateKhateeb(this.inputData)
            this.resetForm()
        },
        async deleteKhateeb() {
            const payload = {
                action: 'delete',
                _id: this.inputData._id
            }
            await this.$API.deleteKhateeb({ _id: this.inputData._id})
            this.resetForm()
        },
        resetForm() {
            this.selectedKhateeb = 'New Khateeb'
            this.inputData = this.emptyKhateeb
        }
    },
    computed: {
        khateebName() {
            return this.selectedKhateeb === 'New Khateeb' ? this.selectedKhateeb : `${this.inputData.firstName} ${this.inputData.lastName}`
        },
        textFields() {
            const fields = this.inputFieldsWithoutID
            for (let field in fields) {
                if (field === 'active' || field === 'dropouts') {
                    delete fields[field]
                }
            }
            return fields
        },
        inputFieldsWithoutID() {
            const x = JSON.parse(JSON.stringify(this.inputData))
            delete x._id
            delete x.__v
            delete x.savedOn
            return x
        },
        notReadyToSubmit() {
            if (this.isMounted) {
                const firstNameIsEmpty = this.inputData.firstName.length  < 1
                const lastNameIsEmpty = this.inputData.lastName.length < 1
                const phoneNumberIsIncomplete = this.inputData.phoneNumber.length !== 10
                return firstNameIsEmpty || lastNameIsEmpty || phoneNumberIsIncomplete
            } else return true
        }
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
        this.inputData = this.emptyKhateeb
        this.khateebData = await this.$API.getKhateebs('yes')
    },
    mounted() {
        this.$nextTick(() => { this.isMounted = true })
    }
}
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <h2>Khateebs</h2>
        <h4>{{ khateebName }}</h4>
        <div>
            Choose a Khateeb to Edit or Create a new khateeb:<br>
            <select id="khateebs" v-model="selected">
                <option
                v-for="(khateeb, ID) in previousEntries" :key="ID"
                :value="ID"
                >
                    {{ khateeb.firstName }} {{ khateeb.lastName }}
                </option>
                <option value="New">Create New Khateeb</option>
            </select>
        </div>
        <cool-btn
            @pushed="remove()"
            v-if="selected !== 'New'"
            buttonText="Delete this Khateeb"
            color="red"
        />
        <div v-for="(property, key) in textFields" :key="key">
            <label :for="key">{{ key }}: </label>
            <div>
                <input type="text" :id="key" v-model="inputData[key]">
            </div>
        </div>
        <div>
            Active: <input type="checkbox" v-model="inputData.active">
        </div>
        <div>
            Dropouts: {{ inputData.dropouts }}
        </div>
        <cool-btn
            color="grey"
            @pushed="submit()"
            buttonText="Submit"
            :isDisabled="notReadyToSubmit"
        />
    </div>
</template>

<script>
import adminForms from '@/mixins/adminForms.js'

export default {
    name: 'editKhateebs',
    mixins: [adminForms],
    data() {
        return {
            formName: 'Khateeb'
        }
    },
    methods: {

    },
    computed: {
        khateebName() {
            return this.selected === 'New' ? this.selected : `${this.inputData.firstName} ${this.inputData.lastName}`
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
            const x = this._.deepCopy(this.inputData)
            delete x._id
            delete x.__v
            delete x.savedOn
            return x
        },
        notReadyToSubmit() {
            if (this.inputData.firstName) {
                const firstNameIsEmpty = this.inputData.firstName.length  < 1
                const lastNameIsEmpty = this.inputData.lastName.length < 1
                const phoneNumberIsIncomplete = this.inputData.phoneNumber.length !== 10
                return firstNameIsEmpty || lastNameIsEmpty || phoneNumberIsIncomplete
            } else return true
        }
    },
    async created() {
        const data = await this.$API.getKhateebs('yes')
        data.emptySchema.active = true
        this.assignAPIData(data)
    }
}
</script>

<style lang="scss" scoped>

div {
    margin-top: 10px;
}

</style>
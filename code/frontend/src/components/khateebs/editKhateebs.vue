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
        <button
            @click="remove()"
            v-if="selected !== 'New'"
            class="red"
        >
            Delete this Khateeb
        </button>
        <div v-for="(property, key) in textFields" :key="key">
            <label :for="key">{{ _.stringFormat(key, 'title') }}: </label>
            <div>
                <input type="text" :id="key" v-model="inputData[key]">
            </div>
            <h4 v-if="validations[key]">
                {{ `Invalid ${key === 'phoneNumber' ? 'canadian' : ''} 
                ${_.stringFormat(key)}` }}
            </h4>
        </div>
        <div>
            Active: <input type="checkbox" v-model="inputData.active">
        </div>
        <div>
            Dropouts: {{ inputData.dropouts }}
        </div>
        <button
            class="grey"
            @click="submit()"
            buttonText="Submit"
            :disabled="notReadyToSubmit"
        >
            Submit
        </button>
    </div>
</template>

<script>
import adminForms from '@/mixins/adminForms.js'
import validation from '@/utils/validationChecks/main.js'

export default {
    name: 'editKhateebs',
    mixins: [adminForms],
    data() {
        return {
            formName: 'Khateeb',
            phoneNumberNotValid: null
        }
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
                return firstNameIsEmpty || lastNameIsEmpty || this.phoneNumberNotValid
            } else return true
        },
        validations() {
                return {
                    phoneNumber: this.phoneNumberNotValid
                }
        },
        phoneNumber() {
            if (this.inputData.phoneNumber) return this.inputData.phoneNumber
            else return ''
        }
    },
    watch: {
        async phoneNumber() {
            this.phoneNumberNotValid = await validation.phoneNumber(this.inputData.phoneNumber)
        }
    },
    async created() {
        const data = await this.$API.getKhateebs('yes')
        data.emptySchema.active = true
        this.assignAPIData(data)
    },
    updated() {
        this.phoneNumberNotValid = validation.phoneNumberLength(this.inputData.phoneNumber)
    }
}
</script>

<style lang="scss" scoped>

div {
    margin-top: 10px;
}

</style>
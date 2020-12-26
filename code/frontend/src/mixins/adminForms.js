import formRenderer from '@/components/forms/formRenderer.vue'
import previousEntriesDropdown from '@/components/forms/previousEntriesDropdown.vue'

export default {
    data() {
        return {
            previousEntries: [],
            selected: 'New',
            inputData: {},
            emptySchema: {}
        }
    },
    components: {
        formRenderer,
        previousEntriesDropdown
    },
    methods: {
        assignAPIData(APIData) {
            this.inputData = APIData.emptySchema
            this.emptySchema = this._.deepCopy(this.inputData)
            this.previousEntries = APIData.previousEntries
        },
        resetForm() {
            this.inputData = this._.deepCopy(this.emptySchema)
            this.selected = 'New'
        },
        async remove() {
            if (window.confirm(`Are you sure you want to delete this ${this.formName}?`)) {
                console.log(this.inputData)
                await this.$API['delete' + this.formName]({ _id: this.inputData._id })
                this.resetForm()
            }
        },
        async submit() {
            if (window.confirm(`Are you sure you want to send this ${this.formName}?`)) {
                await this.$API['update' + this.formName](this.inputData)
                this.resetForm()
            }
        }
    },
    watch: {
        selected(newValue) {
            if (newValue === 'New') {
                this.resetForm()
            } else {
                this.inputData = this._.deepCopy(this.previousEntries[newValue])
            }
        }
    }
}
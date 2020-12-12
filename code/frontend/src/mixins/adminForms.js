export default {
    data() {
        return {
            previousEntries: [],
            selected: 'New',
            inputData: {},
            emptySchema: {}
        }
    },
    methods: {
        assignAPIData(APIData) {
            console.log(APIData)
            this.inputData = APIData.emptySchema
            this.emptySchema = JSON.parse(JSON.stringify(this.inputData))
            this.previousEntries = APIData.previousEntries
        },
        resetForm() {
            this.inputData = JSON.parse(JSON.stringify(this.emptySchema))
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
                this.inputData = JSON.parse(JSON.stringify(this.previousEntries[newValue]))
            }
        }
    }
}
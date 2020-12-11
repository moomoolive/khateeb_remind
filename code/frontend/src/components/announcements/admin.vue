<template>
    <div style="padding-top: 30px;">
        <select v-model="selectedAnnouncement" >
            <option
            v-for="(announcement, ID) in announcementData" :key="ID"
            :value="ID">
                {{ dateDisplay(inputData.savedOn, false) }} || {{ announcement.headline }}
            </option>
            <option value="New">New</option>
        </select>
        <div>
            {{ selectedAnnouncement === 'New' ? dateDisplay(inputData.savedOn) : dateDisplay(inputData.savedOn, false) }}<br>
            headline: 
            <input v-model="inputData.headline" type="text"> 
        </div>
        <button v-if="selectedAnnouncement !== 'New'" @click="removeAnnouncement()">
            Delete This announcement
        </button>
        <div>
            <label>body of your announcement:</label>
            <textarea v-model="inputData.content"></textarea>
        </div>
        <div>
            <input type="checkbox" id="urgent" name="vehicle1" v-model="inputData.urgent">
            <label for="urgent"> Is it Urgent??</label>
            <input type="checkbox" id="important" v-model="inputData.important">
            <label for="important">Is It Very Important??</label>
        </div>
        <button :disabled="!readyToSubmit" @click="submit">Submit</button>
    </div>
</template>

<script>
export default {
    name: 'adminAnnouncements',
    data() {
        return {
            inputData: {
                headline: '',
                content: '',
                urgent: false,
                important: false,
                savedOn: new Date(),

            },
            announcementData: [],
            selectedAnnouncement: 'New'
        }
    },
    methods: {
        async submit() {
            if (window.confirm('Are you sure you want to send this announcement?')) {
                await this.$API.updateAnnouncements(this.inputData)
                this.resetForm()
            }
        },
        removeAnnouncement() {
            return this.$API.deleteAnnouncement({ _id: this.inputData._id })
        },
        resetForm() {
            this.inputData.headline = ''
            this.inputData.content = ''
            this.inputData.urgent = false
            this.inputData.important = false
            this.inputData.savedOn = new Date()
            this.selectedAnnouncement = "New"
            delete this.inputData._id
            delete this.inputData.__v
        },
        dateDisplay(dateString, notDatabase=true) {
            let x
            notDatabase ? x = dateString : x = new Date(dateString)
            const month = x.toLocaleString('default', {month: 'short'})
            const date = x.getDate()
            const year = x.getFullYear()
            return `${month} ${date}, ${year}`
        }
    },
    computed: {
        readyToSubmit() {
            const headlineIsNotEmpty = this.inputData.headline.length > 0
            const bodyIsNotEmpty = this.inputData.content.length > 0
            return headlineIsNotEmpty && bodyIsNotEmpty
        },
        important() {
            return this.inputData.important
        },
        urgent() {
            return this.inputData.urgent
        },
    },
    watch: {
        selectedAnnouncement(newValue) {
            if (this.selectedAnnouncement === 'New') {
                this.resetForm()
            } else {
                this.inputData = JSON.parse(JSON.stringify(this.announcementData[newValue]))
            }
        },
        urgent(newVal) {
            if (newVal === 'false') this.inputData.urgent = false
            else if (newVal === 'true') this.inputData.urgent = true
        },
        important(newVal) {
            if (newVal === 'false') this.inputData.important = false
            else if (newVal === 'true') this.inputData.important = true
        }
    },
    async created() {
        const payload = {
            action: 'get'
        }
        this.announcementData = await this.$API.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
</style>
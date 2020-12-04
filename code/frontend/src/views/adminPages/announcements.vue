<template>
    <div style="padding-top: 30px;">
        <select v-model="selectedAnnouncement" >
            <option
            v-for="(announcement, ID) in announcementData" :key="ID"
            :value="ID">
                {{ announcement.date }} || {{ announcement.headline }}
            </option>
            <option value="New">New</option>
        </select>
        <div>
            {{ inputData.date }} <br>
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
import API from '../../utils/apiCalls.js'

export default {
    name: 'announcements',
    data() {
        return {
            inputData: {
                headline: '',
                content: '',
                urgent: false,
                important: false,
                date: null,
            },
            announcementData: [],
            selectedAnnouncement: 'New'
        }
    },
    methods: {
        async submit() {
            if (window.confirm('Are you sure you want to send this announcement?')) {
                await API.updateAnnouncements(this.$store.state.JWT_TOKEN, this.inputData)
                this.resetForm()
            }
        },
        async removeAnnouncement() {
            const payload = {
                action: 'delete',
                _id: this.inputData._id
            }
            await API.updateAnnouncements(this.$store.state.JWT_TOKEN, payload)
        },
        resetForm() {
            this.inputData.headline = ''
            this.inputData.content = ''
            this.inputData.urgent = false
            this.inputData.important = false
            this.selectedAnnouncement = "New"
            delete this.inputData._id
            delete this.inputData._id
            delete this.inputData.__v
        }
    },
    computed: {
        readyToSubmit() {
            const headlineIsNotEmpty = this.inputData.headline.length > 0
            const bodyIsNotEmpty = this.inputData.content.length > 0

            return headlineIsNotEmpty && bodyIsNotEmpty
        }
    },
    watch: {
        selectedAnnouncement(newValue) {
            if (this.selectedAnnouncement === 'New') {
                this.resetForm()
            } else {
                this.inputData = JSON.parse(JSON.stringify(this.announcementData[newValue]))
                this.date = this.announcementData[newValue].date
            }
        }
    },
    async created() {
        const payload = {
            action: 'get'
        }
        this.announcementData = await API.getAnnouncements(this.$store.state.JWT_TOKEN, payload)
        const dateData = this.$store.state.date.currentDate
        const abbreviatedDate = dateData.month.slice(0,3)
        this.inputData.date = `${abbreviatedDate} ${dateData.date}, ${dateData.year}`
    }
}
</script>

<style lang="scss" scoped>
</style>
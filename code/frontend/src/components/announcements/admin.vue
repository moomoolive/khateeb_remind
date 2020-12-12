<template>
    <div style="padding-top: 30px;">
        <select v-model="selected" >
            <option
            v-for="(announcement, ID) in previousEntries" :key="ID"
            :value="ID">
                {{ dateDisplay(inputData.savedOn, false) }} || {{ announcement.headline }}
            </option>
            <option value="New">New</option>
        </select>
        <div>
            {{ selected === 'New' ? dateDisplay(inputData.savedOn) : dateDisplay(inputData.savedOn, false) }}<br>
            headline: 
            <input v-model="inputData.headline" type="text"> 
        </div>
        <button v-if="selected !== 'New'" @click="remove()">
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
import adminForm from '../../mixins/adminForms.js'

export default {
    name: 'adminAnnouncements',
    mixins: [adminForm],
    data() {
        return {
            formName: 'Announcement'
        }
    },
    methods: {
        dateDisplay(dateString, notDatabase=true) {
            if (dateString) {
                let x = notDatabase ? dateString : new Date(dateString);
                const month = x.toLocaleString('default', {month: 'short'})
                const date = x.getDate()
                const year = x.getFullYear()
                return `${month} ${date}, ${year}`
            }
        }
    },
    computed: {
        readyToSubmit() {
            if (this.inputData.headline) {
                const headlineIsNotEmpty = this.inputData.headline.length > 0
                const bodyIsNotEmpty = this.inputData.content.length > 0
                return headlineIsNotEmpty && bodyIsNotEmpty
            }
        },
        important() {
            return this.inputData.important
        },
        urgent() {
            return this.inputData.urgent
        },
    },
    watch: {
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
        const data = await this.$API.getAnnouncements()
        data.emptySchema.urgent = data.emptySchema.important = false
        this.assignAPIData(data)
    }
}
</script>

<style lang="scss" scoped>
</style>
<template>
    <div>
        headline: 
        <input v-model="headline" type="text">
        <div>
            <label>body of your announcement:</label>
            <textarea v-model="content"></textarea>
        </div>
        <div>
            <input type="checkbox" id="urgent" name="vehicle1" v-model="urgent">
            <label for="urgent"> Is it Urgent??</label>
            <input type="checkbox" id="important" v-model="important">
            <label for="important">Is It Very Important??</label>
        </div>
        <button :disabled="!readyToSubmit" @click="submit">Submit</button>
    </div>
</template>

<script>
import API from '../../utils/apiCalls.js'

export default {
    name: 'setAnnouncements',
    data() {
        return {
            headline: '',
            content: '',
            urgent: false,
            important: false
        }
    },
    methods: {
        async submit() {
            if (window.confirm('Are you sure you want to send this announcement?')) {
                const payload = {
                    headline: this.headline,
                    content: this.content,
                    urgent: this.urgent,
                    important: this.important,
                    currentDate: this.$store.state.date.currentDate
                }
                await API.sendNewAnnouncement(this.$store.state.JWT_TOKEN, payload)
                this.initForm()
            }
        },
        initForm() {
            this.headline = ''
            this.content = ''
            this.urgent = false
            this.important = false
        }
    },
    computed: {
        readyToSubmit() {
            const headlineIsNotEmpty = this.headline.length > 0
            const bodyIsNotEmpty = this.content.length > 0

            return headlineIsNotEmpty && bodyIsNotEmpty
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
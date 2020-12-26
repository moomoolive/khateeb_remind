<template>
    <div class="gradient1">
        <previous-entries-dropdown 
            :inputData="inputData"
            :previousEntries="previousEntries"
            :selected="selected"
            @changed="selected = $event"
            :displayName="['headline']"
        />
        {{ previousEntries[selected] ? dateDisplay(previousEntries[selected].savedOn, false) : '' }}
        <form-renderer
            :inputData="inputData"
            :bigText="['content']"
            :textFieldInvalidMsg="{
                headline: `default`,
                content: `default`
            }"
        />
        <button
            class="grey"
            :disabled="notReadyToSubmit"
            @click="submit()"
        >
            Submit
        </button>
    </div>
</template>

<script>
import adminForm from '@/mixins/adminForms.js'

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
        notReadyToSubmit() {
            if (this.inputData.headline) {
                return this.headlineNotValid || this.contentNotValid
            } else return true
        },
        headlineNotValid() {
            return this.inputData.headline.length < 1
        },
        contentNotValid() {
            return this.inputData.content.length < 1
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
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("yellow");

</style>
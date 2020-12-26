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
            :groupInvalidation="groupInvalidation"
            :textFieldInvalidMsg="{
                content: 'Content cannot be empty'
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
import invalidations from '@/mixins/invalidations/index.js'

export default {
    name: 'adminAnnouncements',
    mixins: [adminForm, invalidations.emptyField],
    data() {
        return {
            formName: 'Announcement',
            groupInvalidation: {
                emptyField: ['content', 'headline']
            }
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
                return this.emptyField.headline || this.emptyField.content
            } else return true
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
        const data = await this.$API.admin.getAnnouncements()
        data.emptySchema.urgent = data.emptySchema.important = false
        this.assignAPIData(data)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("yellow");

</style>
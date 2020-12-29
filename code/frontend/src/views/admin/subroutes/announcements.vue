<template>
    <div>
        <Form
            :name="`announcements`"
            :emptySchema="emptySchema"
            :previousEntries="previousEntries"
            :previousEntriesNaming="previousEntriesNaming"
            :bigText="['content']"
            :invalidations="invalidations"
            :customInvalidMsg="{
                content: 'Content cannot be empty'
            }"
            @submitted="submit($event)"
            @remove="remove($event)"
        />
    </div>
</template>

<script>
import Form from '@/components/appBuildingBlocks/forms/formRenderer.vue'

export default {
    name: 'announcements',
    components: {
        Form
    },
    data() {
        return {
            previousEntries: null,
            emptySchema: null,
            invalidations: {
                emptyField: ['headline', 'content']
            }
        }
    },
    methods: {
        async getAnnouncements() {
            const data = await this.$API.admin.getAnnouncements()
            data.emptySchema.urgent = data.emptySchema.important = false
            this.assignAPIData(data)
        },
        assignAPIData(data) {
            this.emptySchema = data.emptySchema
            this.previousEntries = data.previousEntries
        },
        async submit($event) {
            const response = await this.$API.admin.updateAnnouncement($event)
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
        async remove($event) {
            const response = await this.$API.admin.deleteAnnouncement({ _id: $event })
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
        previousEntriesNaming(data) {
            const headline = data.headline
            const date = new Date(data.savedOn)
            const month = date.toLocaleString('default', { month: 'short' })
            return `${month} ${date.getDate()} || ${headline}`
        }
    },
    created() {
        this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
</style>
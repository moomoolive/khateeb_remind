<template>
    <div>
        <Form
            :inputData="inputData"
            :previousEntries="previousEntries"
            :emptySchema="emptySchema"
            :displayName="['headline']"
            :bigText="['content']"
            :invalidations="invalidations"
        />
    </div>
</template>

<script>
import Form from '@/components/forms/main.vue'

export default {
    name: 'announcements',
    components: {
        Form
    },
    data() {
        return {
            previousEntries: null,
            emptySchema: null,
            inputData: null,
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
            this.inputData = data.emptySchema
            this.emptySchema = this._.deepCopy(this.inputData)
            this.previousEntries = data.previousEntries
        }
    },
    created() {
        this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
</style>
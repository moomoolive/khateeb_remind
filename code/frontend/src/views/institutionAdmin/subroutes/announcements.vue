<template>
    <div>
        <form-main
            :structure="structure"
            @submitted="submit($event)"
            :formTitle="`Announcements`"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: 'announcements',
    components: {
        formMain
    },
    data() {
        return {
            structure: {
                headline: {
                    required: true
                },
                content: {
                    type: 'textArea',
                    required: true
                },
                important: {
                    type: 'checkbox',
                    required: true,
                    default: false
                },
                urgent: {
                    type: 'checkbox',
                    required: true,
                    default: false
                }
            }
        }
    },
    methods: {
        async submit($event) {
            try {
                const msg = await this.$API.institutionAdmin.updateAnnouncements($event)
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async getAnnouncements() {
            const data = await this.$API.admin.getAnnouncements()
            data.emptySchema.urgent = data.emptySchema.important = false
            this.assignAPIData(data)
        },
        assignAPIData(data) {
            this.emptySchema = data.emptySchema
            this.previousEntries = data.previousEntries
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
        //this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
</style>
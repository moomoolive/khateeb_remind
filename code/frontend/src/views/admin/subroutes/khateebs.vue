<template>
    <div>
        <Form
            :name="`khateebs`"
            :emptySchema="emptySchema"
            :previousEntries="previousEntries"
            :previousEntriesNaming="previousEntriesNaming"
            :doNotRender="['dropouts']"
            :invalidations="invalidations"
            :customInvalidMsg="{
                phoneNumber: 'This is not a valid canadian phone number'
            }"
            :backgroundColor="`green-offWhite`"
            @submitted="submit($event)"
            @remove="remove($event)"
        />
    </div>
</template>

<script>
import Form from '@/components/appBuildingBlocks/forms/formRenderer.vue'

export default {
    name: 'khateebs',
    components: {
        Form
    },
    data() {
        return {
            previousEntries: null,
            emptySchema: null,
            invalidations: {
                emptyField: ['firstName', 'lastName', 'email'],
                phoneNumberNotValid: ['phoneNumber']
            }
        }
    },
    methods: {
        async getKhateebs() {
            const data = await this.$API.admin.getKhateebs('yes')
            data.emptySchema.active = true
            this.assignAPIData(data)
        },
        assignAPIData(data) {
            this.emptySchema = data.emptySchema
            this.previousEntries = data.previousEntries
        },
        previousEntriesNaming(data) {
            return `${data.firstName} ${data.lastName}`
        },
        async submit($event) {
            const response = await this.$API.admin.updateKhateeb($event)
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
        async remove($event) {
            const response = await this.$API.admin.deleteKhateeb({ _id: $event })
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
    },
    created() {
        this.getKhateebs()
    }
}
</script>

<style lang="scss" scoped>

</style>
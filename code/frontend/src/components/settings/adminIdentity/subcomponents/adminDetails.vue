<template>
    <div>
        <Form
            :name="`admin profile`"
            :emptySchema="emptySchema.options"
            :invalidations="invalidations"
            :backgroundColor="`yellow-green`"
            @submitted="submit($event)"
        />
    </div>
</template>

<script>
import Form from '@/components/appBuildingBlocks/forms/formRenderer.vue'

export default {
    name: 'adminDetails',
    components: {
        Form
    },
    data() {
        return {
            emptySchema: {
                options: null
            },
            invalidations: {
                emptyField: ['firstName', 'lastName', 'email']
            }
        }
    },
    methods: {
        async submit($event) {
            this.emptySchema.options = $event
            const response = await this.$API.admin.updateSetting(this.emptySchema)
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        }
    },
    async created() {
        const response = await this.$API.admin.getSetting('adminProfile')
        if (response.previousEntries[0]) {
            this.emptySchema = response.previousEntries[0]
        } else this.emptySchema = response.emptySchema
    }
}
</script>

<style lang="scss" scoped>

</style>
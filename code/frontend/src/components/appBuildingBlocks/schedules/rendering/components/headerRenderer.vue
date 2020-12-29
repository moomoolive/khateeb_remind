<template>
    <div>
        <component
            :is="componentX"
            :lastUpdated="lastUpdated"
            :display="display"
            :week="week"
            @change="$emit('change', $event)"
        />
    </div>
</template>

<script>
export default {
    name: 'headerRenderer',
    props: {
        table: {
            type: String,
            required: true
        },
        display: {
            type: Object,
            required: true
        },
        week: {
            type: [Number, String],
            required: true
        },
        lastUpdatedDateString: {
            type: String,
            required: false
        }
    },
    computed: {
        lastUpdated() {
            const date = new Date(this.lastUpdatedDateString) 
            const month = date.toLocaleString('default', {month: 'long'})
            return `Last Updated: ${month} ${date.getDate()}, ${date.getFullYear()}`
        },
        componentX() {
            return () => import(`@/components/appBuildingBlocks/schedules/renderedComponents/headers/${this.table}.vue`)
        }
    }
    
}
</script>

<style>

</style>
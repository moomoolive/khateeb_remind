<template>
    <div style="padding-top: 10px;">
        <cool-btn
            v-if="groupSave"
            @pushed="save()"
            :isDisabled="isDisabled"
            buttonText="Save"
            color="grey"
            style='margin-bottom: 10px;'
        />
        <component ref="child" :is="settingName" />
    </div>
</template>

<script>
export default {
    name: "settingsTemplate",
    components: {
        'locationTiming': () => import('@/components/settings/locationTiming/main.vue'),
        'adminPerson': () => import('@/components/settings/adminPerson/main.vue')
    },
    props: {
        settingName: {
            type: String,
            required: true
        },
        groupSave: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            isComponentLoaded: false
        }
    },
    methods: {
        save() {
            this.$refs.child.save()
        }
    },
    computed: {
        isDisabled() {
            if (this.isComponentLoaded) return this.$refs.child.isDisabled
        }
    },
    updated() {
        this.isComponentLoaded = true
    }
}
</script>

<style lang="scss" scoped>

</style>
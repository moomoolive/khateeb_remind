<template>
    <div style="padding-top: 10px;">
        <button
            v-if="groupSave"
            @click="save()"
            :disabled="isDisabled"
            class="grey"
        >
            Save
        </button>
        <component ref="child" :is="settingName" />
    </div>
</template>

<script>
export default {
    name: "settingsTemplate",
    components: {
        'locationTiming': () => import('@/components/settings/locationTiming/main.vue'),
        'adminIdentity': () => import('@/components/settings/adminIdentity/main.vue'),
        'textService': () => import('@/components/settings/textService/main.vue')
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
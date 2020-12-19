<template>
    <div style="padding-top: 10px;">
        <collapsable-box
            v-for="(setting, index) in settingsTabs.tabs" :key="index"
            :headline="_.parseCamelCase(setting.componentName, 'title')"
            :options="{
                settingName: setting.componentName,
                groupSave: setting.groupSave
            }"
            :pathToComponentFromComponents="settingsTabs.path"
            :contentWidth="settingsTabs.width"
        />
    </div>
</template>

<script>
export default {
    name: "settings",
    data() {
        return {
            settingsTabs: {
                width: 90,
                path: 'settings/template',
                tabs: [
                    {
                        componentName: 'locationTiming',
                        groupSave: true
                    },
                    {
                        componentName: 'adminIdentity',
                        groupSave: false
                    },
                    {
                        componentName: 'textService',
                        groupSave: false
                    }
                ]
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
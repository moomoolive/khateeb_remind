<template>
    <div style="padding-top: 10px;">
        <collapsable-box
            v-for="(setting, index) in settingsTabs.tabs" :key="index"
            :headline="setting.headline"
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
                        headline: 'Location and Timing',
                        componentName: 'locationTiming',
                        groupSave: true
                    },
                    {
                        headline: 'Administrator Identity',
                        componentName: 'adminPerson',
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
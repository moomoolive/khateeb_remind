<template>
    <div>
        <collapsable-box
            v-for="(tab, index) in tabList.tabs" :key="index"
            :pathToComponentFromComponents="`${tabList.baseURL}${tab.path}`"
            :headline="parsedName(tab.path)"
        />
    </div>
</template>

<script>
export default {
    name: 'adminPersonIdentity',
    data() {
        return {
            tabList: {
                baseURL: 'settings/adminIdentity/subcomponents', 
                tabs: [
                {
                    path: `/updatePassword`
                },
                {
                    path: `/adminDetails`
                }
            ]
            }
        }
    },
    methods: {
        parsedName(relativePath) {
            const x = relativePath.slice(1)
            return this._.parseCamelCase(x, 'title')
        }
    }
}
</script>

<style>

</style>
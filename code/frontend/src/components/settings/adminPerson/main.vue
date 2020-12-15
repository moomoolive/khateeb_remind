<template>
    <div>
        <collapsable-box
            v-for="(tab, index) in tabList.tabs" :key="index"
            :pathToComponentFromComponents="`${tabList.baseURL}${tab.path}`"
            :headline="tab.headline"
        />
    </div>
</template>

<script>
export default {
    name: 'adminPersonIdentity',
    data() {
        return {
            tabList: {
                baseURL: 'settings/adminPerson/subcomponents', 
                tabs: [
                {
                    headline: 'Update Password',
                    path: `/updatePassword`
                }
            ]
            }
        }
    }
}
</script>

<style>

</style>
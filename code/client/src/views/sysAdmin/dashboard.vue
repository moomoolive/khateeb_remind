<template>
    <div>
        <central-nav 
            :outboundLinks="outboundLinks"
            :baseLink="`sysAdmin`"
        />
        <vue-page-transition name="fade-in-down">
            <router-view></router-view>
        </vue-page-transition>
    </div>
</template>

<script>
import centralNav from '@/components/misc/centralNav.vue'

export default {
    name: 'sysAdminDashboard',
    components: {
        centralNav
    },
    data() {
        return {
            outboundLinks: [
                {
                    name: "Institutions",
                    route: 'institutions'
                },
                {
                    name: "System Settings",
                    route: 'settings'
                }
            ]
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>

</style>
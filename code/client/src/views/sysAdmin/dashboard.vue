<template>
    <div>
        <central-nav 
            :outboundLinks="outboundLinks"
            :baseLink="`sysAdmin`"
        />
        <vue-page-transition :name="routerConfig.animationName">
            <router-view></router-view>
        </vue-page-transition>
    </div>
</template>

<script>
import centralNav from '@/components/misc/centralNav.vue'

import Config from '$config'

export default {
    name: 'sysAdminDashboard',
    components: {
        centralNav
    },
    data() {
        return {
            routerConfig: Config.routerConfig,
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
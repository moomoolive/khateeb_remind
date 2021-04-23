<template>
    <div>
        <central-nav 
            :outboundLinks="outboundLinks"
            :baseLink="`sysAdmin`"
        />
        <transition
            name="fade"
            mode="out-in"
        >
            <router-view></router-view>
        </transition>
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
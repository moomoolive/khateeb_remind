<template>
    <div>
        <central-nav 
            :outboundLinks="outboundLinks"
            :baseLink="`root`"
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
                    name: 'Command Line',
                    route: 'cli'
                },
                {
                    name: 'Roaming Mode',
                    route: 'roaming'
                }
            ]
        }
    },
    methods: {
        toCLI() {
            this.$router.push('/root/cli')
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    max-width: 100px;
    font-size: 17px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-bottom: 20px;
}

@media screen and (max-width: $phoneWidth) {
    button {
        margin-top: 4vh;
        font-size: 2.5vh;
        margin-bottom: 3vh;
    }
}
</style>
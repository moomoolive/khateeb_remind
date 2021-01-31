<template>
    <div>
        <button @click="toCLI()">To Cli</button>
        <transition
            name="fade"
            mode="out-in"
        >
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'sysAdminDashboard',
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
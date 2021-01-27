<template>
    <div class="green">
        <div class="redirectContainer">
            <button
                v-for="(redirect, index) in options.redirections"
                :key="index"
                class="blue"
                @click="toDestination(redirect.to)"
            >
                {{ redirect.text }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'redirectNotification',
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    methods: {
        toDestination(ext) {
            this.$router.push(ext)
            this.$store.dispatch('closeNotification')
        }
    }
}
</script>

<style lang="scss" scoped>
.green {
        background: themeRGBA("green", 0.75);
}

button {
    width: 75%;
    font-size: 2vh;
}

.redirectContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

</style>
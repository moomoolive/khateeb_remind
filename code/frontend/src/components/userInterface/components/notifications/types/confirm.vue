<template>
    <div class="background">
        <img :src="require(`@/assets/notifications/exclamation.png`)">
        <p>
            {{ options.msg }}
        </p>
        <button @click="confirm()">Yes</button>
        <button class="red" @click="reject()">No</button>
    </div>
</template>

<script>
export default {
    name: "confirmNotification",
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    methods: {
        confirm() {
            this.$store.state.notifications.options.resolve(true)
            this.$store.dispatch('closeNotification')
        },
        reject() {
            this.$store.state.notifications.options.reject(false)
            this.$store.dispatch('closeNotification')
        }
    }
}
</script>

<style lang="scss" scoped>
.background {
    background: themeRGBA("yellow", 0.75);
}

img {
    height: 40%;
    padding-top: 7%;
}

button {
    width: 30%;
    height: 15%;
    font-size: 17px;
}

p {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    font-size: 16px;
}

@media screen and (max-width: $phoneWidth) {
    button {
        font-size: 2.3vh;
    }

    p {
        font-size: 2vh;
    }
}
</style>
<template>
    <div>
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
img {
    height: 18vh;
    max-height: 150px;
    padding-top: 10px;
}

button {
    width: 30%;
    height: 15%;
    font-size: 17px;
    margin-bottom: 5%;
}

p {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    font-size: 16px;
    font-weight: bold;
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
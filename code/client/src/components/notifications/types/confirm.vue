<template>
    <div class="confirm-container">
        <img 
            :src="require(`@/assets/notifications/${options.picture || 'exclamation'}.png`)"
        >
        <div class="msg-spacing">
            <p 
                v-for="msg in options.msg.split('\n')" :key="msg"
                :style="`text-align: center;`"
            >
                {{ msg }}
            </p>
        </div>
        <button @click="confirm()">
            {{ options.confirmButtonText || "Yes" }}
        </button>
        <button class="red" @click="reject()">
            {{ options.rejectButtonText || "No" }}
        </button>
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
            this.options.resolve(true)
            this.$emit('close')
        },
        reject() {
            this.options.reject(false)
            this.$emit('close')
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
    padding-bottom: 0px;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
}

.msg-spacing {
    margin-bottom: 15px;
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
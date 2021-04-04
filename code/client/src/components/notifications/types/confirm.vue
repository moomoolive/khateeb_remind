<template>
    <div class="confirm-container">
        
        <img 
            :src="require(`@/assets/notifications/${options.picture || 'exclamation'}.png`)"
        >

        <div class="msg-spacing">
            <p v-for="msg in options.msg.split('\n')" :key="msg">
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
    min-height: 100px;
    height: 18vh;
    max-height: 150px;
    margin-top: 20px;
}

.confirm-container {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 375px;
}

button {
    width: 30%;
    height: 15%;
    font-size: 17px;
    margin-bottom: 30px;
    @include floatingBoxShadow();
}

p {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 0px;
    margin-bottom: 5px;
    line-height: 25px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}

.msg-spacing {
    margin-bottom: 25px;
    margin-top: 25px;
}

@media screen and (max-width: $phoneWidth) {
    
    button {
        font-size: 14px;
    }

    p {
        font-size: 12px;
        line-height: 20px;
    }
}
</style>
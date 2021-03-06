<template>
    <div>
        <div class="redirectContainer">
            <p v-if="options.msg">{{ options.msg }}</p>
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
            if (this.$route.path !== ext)
                this.$router.push(ext)
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>

button {
    width: 75%;
    font-size: 18px;
}

.redirectContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
}

p {
    margin-top: 5%;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    height: auto;
    color: black;
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
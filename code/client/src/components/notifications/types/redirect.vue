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
    height: 33px;
    font-size: 18px;
    @include floating-box-shadow();
}

.redirectContainer {
    @include flexbox-default(column);
    padding-top: 10px;
    padding-bottom: 10px;
}

p {
    margin-top: 5px;
    @include center-margin();
    width: 80%;
    color: black;
    font-size: 16px;
    font-weight: bold;
}

@media screen and (max-width: $phone-width) {
    
    button {
        font-size: 13px;
        height: 25px;
    }

    p {
        font-size: 13px;
    }
}

</style>
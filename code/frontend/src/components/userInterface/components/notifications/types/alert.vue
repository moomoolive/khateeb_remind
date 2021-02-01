<template>
    <div v-if="display">
        <div :class="display.color">
            <div class="topAnchor"></div>
            <img :src="require(`@/assets/notifications/${display.icon}.png`)">
            <div :class="`msg ${display.textSize ? display.textSize : 'large'}`">
                {{ display.msg }}<br>
            </div>
            <button
                class="grey" 
                @click="close()"
            >
                OK
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'alertNotification',
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            display: null
        }
    },
    methods: {
        handleEnter($event) {
            const enter = 13
            if ($event.keyCode === enter)
                this.close()
        },
        close() {
            this.$store.dispatch('closeNotification')
        }
    },
    created() {
        this.display = this._.deepCopy(this.options)
        document.addEventListener('keyup', this.handleEnter)
    },
    destroyed() {
        document.removeEventListener('keyup', this.handleEnter)
    }
}
</script>

<style lang="scss" scoped>
div {
    margin: 0;
    padding: 0;
}

.red {
        background: themeRGBA("red", 0.75);
}

.yellow {
        background: themeRGBA("yellow", 0.75);
}

.msg {
    margin-top: 5%;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    height: auto;
    color: black;
    &.small {
        font-size: 2vh;
        font-weight: bold;
    }
    &.large {
        font-size: 4vh;
    }
}

.topAnchor {
    height: 1vh;
}

img {
    height: 40%;
}

button {
    margin-top: 7%;
    width: 30%;
    height: 15%;
    margin-bottom: 20%;
}

</style>
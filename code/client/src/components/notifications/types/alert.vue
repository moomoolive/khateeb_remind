<template>
    <div v-if="options">
        <div>
            <div class="topAnchor"></div>
            <img :src="require(`@/assets/notifications/${graphicType(options.icon)}`)">
            <div :class="`msg ${options.textSize ? options.textSize : 'large'}`">
                {{ options.msg }}<br>
            </div>
            <button
                class="grey" 
                @click="$emit('close')"
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
        }
    },
    methods: {
        handleEnter($event) {
            const enter = 13
            if ($event.keyCode === enter)
                this.$emit('close')
        },
        graphicType(name) {
            if (this.options.graphicType)
                return `${name}.${this.options.graphicType}`
            else
                return `${name}.png`
        }
    },
    created() {
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

.msg {
    margin-top: 5%;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    height: auto;
    color: black;
    &.small {
        font-size: 16px;
        font-weight: bold;
    }
    &.large {
        font-size: 32px;
    }
}

.topAnchor {
    height: 8px;
}

img {
    height: 18vh;
    max-height: 150px;
}


button {
    margin-top: 4%;
    width: 30%;
    height: 15%;
    max-height: 40px;
    margin-bottom: 15px;
}

@media screen and (max-width: $phoneWidth) {
    .msg {
    &.small {
        font-size: 2vh;
    }
    &.large {
        font-size: 4vh;
    }
}
}

</style>
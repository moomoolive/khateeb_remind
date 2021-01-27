<template>
    <div v-if="display">
        <div :class="display.color">
            <div class="topAnchor"></div>
            <img :src="require(`@/assets/notifications/${display.icon}.png`)">
            <div :class="`msg ${display.textSize ? display.textSize : 'large'}`">
                {{ display.msg }}<br>
                <button
                    class="grey" 
                    @click="close()"
                >
                    OK
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import alertExtras from './alertExtras.json'

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
            templates: { ...alertExtras.templates },
            display: null
        }
    },
    methods: {
        fillTemplate(templateName) {
            const display = {}
            for (let [key, value] of Object.entries(this.templates[templateName])) {
                display[key] = value
            }
            return display
        },
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
        if (this.options.template)
            this.display = this.fillTemplate(this.options.template)
        else
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
.green {
        background: themeRGBA("green", 0.75);
}

.red {
        background: themeRGBA("red", 0.75);
}

.yellow {
        background: themeRGBA("yellow", 0.75);
}

.msg {
    margin-top: 5%;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
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
}

</style>
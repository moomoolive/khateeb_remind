<template>
    <div v-if="display">
        <div :class="display.color">
            <div class="topAnchor"></div>
            <div class="icon">
                {{ icons[display.icon] }}
            </div>
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
            icons: { ...alertExtras.icons },
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
        background: linear-gradient(
        to right bottom,
        themeRGBA("green", 0.9),
        themeRGBA("green", 0.6)
        );
}

.red {
        background: linear-gradient(
        to right bottom,
        themeRGBA("red", 0.9),
        themeRGBA("red", 0.6)
        );
}

.yellow {
        background: linear-gradient(
        to right bottom,
        themeRGBA("yellow", 0.9),
        themeRGBA("yellow", 0.6)
        );
}

.msg {
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

.icon {
    $size: 10vh;
    height: $size;
    font-size: $size;
    margin-bottom: 5vh;
}

button {
    margin-top: 2.5vh;
}

</style>
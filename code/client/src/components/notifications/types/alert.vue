<template>
    <div v-if="options" class="alert-container">
        <div>

            <span :class="options.iconColor || 'grey'">
                <fa-icon 
                    class="icon"
                    :icon="options.icon || `exclamation-triangle`" 
                />
            </span>
            
            <div class="msg-container">
                <div v-if="options.headline" class="headline">
                    {{ options.headline }}
                </div>

                <div :class="`msg ${options.textSize ? options.textSize : 'large'}`">
                    {{ options.msg }}<br>
                </div>
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
.msg {
    margin-left: auto;
    margin-right: auto;
    line-height: 23px;
    width: 85%;
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

.msg-container {
    margin-top: 25px;
}

.headline {
    font-size: 25px;
    font-weight: bold;
}

.topAnchor {
    height: 8px;
}

img {
    min-height: 100px;
    height: 18vh;
    max-height: 150px;
    margin-top: 15px;
}

.icon {
    margin-top: 20px;
    font-size: 110px;
}


button {
    margin-top: 4%;
    font-size: 13px;
    width: 30%;
    height: 30px;
    margin-bottom: 20px;
    margin-top: 20px;
    @include floating-box-shadow();
}

.alert-container {
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 350px;
}

@media screen and (max-width: $phone-width) {
    
    .msg {
        line-height: 18px;
        &.small {
            font-size: 13px;
        }
        &.large {
            font-size: 26px;
        }
    }
    
    .headline {
        font-size: 21px;
    }
}

</style>
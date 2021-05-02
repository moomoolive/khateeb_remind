<template>
    <div class="popup-layer">
        <collapse-transition :duration="duration">
            <div 
                v-show="showContent" 
                class="content-container" 
                v-on-clickaway="clickAwayClose"
            >
                <div class="close-content" @click="close()">Close</div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"
import { mixin as clickaway } from 'vue-clickaway'

export default {
    name: 'generalPopupContainer',
    mixins: [clickaway],
    components: {
        CollapseTransition
    },
    props: {
        duration: {
            type: Number,
            required: false,
            default: 500
        },
        closeOnClickAway: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            showContent: false
        }
    },
    methods: {
        clickAwayClose() {
            if (this.closeOnClickAway)
                this.close()
        },
        close() {
            this.$emit('close')
        }
    },
    mounted() {
        this.$nextTick(() => this.showContent = true)
    }
}
</script>

<style lang="scss" scoped>
.popup-layer {
  z-index: 8;
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: get-color('grey', 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
}

.content {
    padding-top: 10px;
    padding-bottom: 10px;
}

.close-content {
    height: 30px;
    font-size: 20px;
    background: get-color("silver");
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.content-container {
    max-height: 350px;
    max-width: 350px;
    width: 90%;
    height: auto;
    border-radius: 4px;
    background: get-color("grey");
    padding-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    overflow: hidden;
}
</style>
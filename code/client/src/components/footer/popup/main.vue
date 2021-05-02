<template>
    <div :class="`popup-container ${backgroundColor}`">
        <span class="close-button" @click="close()">X</span>
        <div class="content">
            <component 
                :is="componentsInfo.type"
                :componentsProps="componentsInfo.componentsProps"
                @close="close()"
            />
        </div>
    </div>
</template>

<script>
import statusUpdate from './types/statusUpdate.vue'

export default {
    name: "footerPopup",
    components: {
        "statusUpdate": statusUpdate
    },
    data() {
        return {
            color: 'blue'
        }
    },
    methods: {
        close() {
            this.$store.commit('footerPopup/close')
        },
        closeAfter(seconds=4) {
            const milliSecondsInASecond = 1_000
            window.setTimeout(() => this.close(), seconds * milliSecondsInASecond)
        }
    },
    computed: {
        componentsInfo() {
            return this.$store.state.footerPopup.options
        },
        backgroundColor() {
            return this.componentsInfo.componentsProps.color || 'blue'
        },
        showInfoFooterPopup() {
            return this.$store.state.footerPopup.show
        }
    },
    watch: {
        showInfoFooterPopup(newVal) {
            if (!newVal)
                return
            if (this.componentsInfo.componentsProps.closeAfter)
                this.closeAfter(this.componentsInfo.componentsProps.closeAfter)
        }
    }
}
</script>

<style lang="scss" scoped>
.popup-container {
    background: get-color("blue");
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 15px;
    padding-bottom: 15px;
}

.close-button {
    position: absolute;
    font-size: 15px;
    right: 5px;
    top: 5px;
}

.content {
    margin-top: 5%;
}
</style>
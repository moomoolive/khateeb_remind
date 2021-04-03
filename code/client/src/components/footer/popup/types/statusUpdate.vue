<template>
    <div>
        <div class="message-box top">
            {{ componentsProps.topMessage || 'Updating...' }}
        </div>
        <img 
            :src="require(`@/assets/gifs/${this.componentsProps.gif || 'loading'}.gif`)" 
            class="gif"
        >
        <div v-if="componentsProps.bottomMessage" class="message-box">
            {{ componentsProps.bottomMessage }}
        </div>
    </div>
</template>

<script>
export default {
    name: "footerPopupStatusUpdate",
    props: {
        componentsProps: {
            type: Object,
            required: true
        }
    },
    computed: {
        
    }
}
</script>

<style lang="scss" scoped>
.message-box {
    height: 20%;
    font-size: 13px;
    &.top {
        font-weight: bold;
        height: 15%;
    }
}

.gif {
    height: 125px;
}

</style>
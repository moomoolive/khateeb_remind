<template>
    <div :class="`tag-container ${info.color} ${square ? 'square' : ''}`">
        <div class="text">{{ info.icon }} {{ info.words }}</div>
    </div>
</template>

<script>
export default {
    name: 'tagCircle',
    props: {
        info: {
            type: Object,
            required: true
        },
        size: {
            type: String,
            required: false,
            default: "medium"
        },
        square: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>

.tag-container {
    background-color: getColor("green");
    padding-left: 17px;
    padding-right: 17px;
    padding-bottom: 8px;
    padding-top: 8px;    
    font-size: 16px;
    @include completelyRoundBorder();
    @include floatingBoxShadow(0.4);
    @include flexboxDefault();
    color: black;
    
    &.red {
        color: getColor("offWhite");
    }
    
    &.purple {
        color: getColor("offWhite");
    }
    
    &.blue {
        color: getColor("offWhite");
    }

    &.square {
        border-radius: 0px;
    }
}

@media screen and (max-width: $phoneWidth) {
    
    .tag-container {
        font-size: 13px;
        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 5px;
        padding-top: 5px; 
    }
    
}
</style>
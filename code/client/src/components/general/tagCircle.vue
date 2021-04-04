<template>
    <div :class="`tag-container ${info.color} ${square ? 'square' : ''} ${size}`">
        <div class="text">
            {{ info.icon }} 
            <span :class="textColor || ''">{{ info.words }}</span>
        </div>
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
        },
        textColor: {
            type: String,
            required: false,
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

    &.small {
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-top: 5px;    
        font-size: 14px;
    }
    
    &.red {
        color: getColor("offWhite");
    }
    
    &.purple {
        color: getColor("offWhite");
    }
    
    &.blue{
        color: getColor("offWhite");
    }

    &.grey {
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

        &.small {
            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 5px;
            padding-top: 5px;    
            font-size: 12px;
        } 
    }
    
}
</style>
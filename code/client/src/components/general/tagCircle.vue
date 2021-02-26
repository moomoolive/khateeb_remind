<template>
    <div :class="`tag-container ${info.color}`">
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
        }
    }
}
</script>

<style lang="scss" scoped>
.tag-container {
    background-color: getColor("green");
    width: 90%;
    font-size: 18px;
    max-height: 45px;
    border-radius: 100px 100px 100px 100px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
    color: black;
    &.green {
        color: black;
        background-color: getColor("green");
    }
    &.red {
        color: getColor("offWhite");
        background-color: getColor("red");
    }
    &.purple {
        color: getColor("offWhite");
        background-color: getColor("purple");
    }
    &.blue {
        background-color: getColor("blue");
        color: getColor("offWhite");
    }
}

.text {
    margin-top: 5.7%;
}

@media screen and (max-width: $phoneWidth) {
    .tag-container {
        font-size: 2vh;
    }
    .text {
        margin-top: 5%;
    }
}
</style>
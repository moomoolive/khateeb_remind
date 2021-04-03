<template>
    <div>
        <div class="content-container">
            <h2 v-if="title">{{ title }}</h2>
            <img :src="require(`@/assets/gifs/${gif}.gif`)">
            <h2 :class="textColor" >{{ msg }}</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: "msgWithPic",
    props: {
        title: {
            required: false,
            type: String
        },
        msg: {
            required: true,
            type: String
        },
        gif: {
            required: true,
            type: String
        },
        textColor: {
            type: String,
            required: false,
            default: 'default'
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    height: 40vh;
    max-width: 1000px;
    max-height: 1000px;
    @include centerMargin();
}

.content-container {
    width: 88%;
    max-width: 1000px;
    max-height: 1000px;
    @include centerMargin();
}

h2 {
    font-size: 35px;
    &.white {
        color: getColor("offWhite");
    }
}

div {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

@media screen and (max-width: $phoneWidth) {
    h2 {
        font-size: 24px;
    }
}

@media screen and (min-width: $desktopWidth) {
    h2 {
        font-size: 37px;
    }
}

</style>
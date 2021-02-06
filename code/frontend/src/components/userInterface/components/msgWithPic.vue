<template>
    <div>
        <h2 v-if="title">{{ title }}</h2>
        <img :src="require(`@/assets/gifs/${gif}.gif`)" alt="">
        <h2>{{ msg }}</h2>
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
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    height: 40vh;
    max-width: 1000px;
    max-height: 1000px;
}

h2 {
    font-size: 35px;
}

div {
    width: 88%;
    margin-left: auto;
    margin-right: auto;
    max-width: 1100px;
}

@media screen and (max-width: $phoneWidth) {
    h2 {
        font-size: 4vh;
    }
}

@media screen and (min-width: $desktopWidth) {
    h2 {
        font-size: 37px;
    }
}

</style>
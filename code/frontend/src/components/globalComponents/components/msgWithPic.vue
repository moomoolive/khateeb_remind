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
    $size: 40vh;
    width: $size;
    height: $size;
}

h2 {
    font-size: 4vh;
}

div {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}
</style>
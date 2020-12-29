<template>
    <div class="top">
        <p>{{ leftMessage }}</p>
        <label class="switch" :aria-label="altText">
            <input type="checkbox">
            <span class="slider round" @click="$emit('slider-toggled')"></span>
        </label>
        <p>{{ rightMessage }}</p>
    </div>
</template>

<script>
export default {
    name: 'sliderButton',
    props: {
        leftMessage: {
            type: String,
            required: false
        },
        rightMessage: {
            type: String,
            required: false
        },
        altText: {
          type: String,
          required: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/components/sliderButton.scss";
</style>
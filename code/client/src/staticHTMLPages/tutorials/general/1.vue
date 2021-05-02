<template>
    <div>
        <h1>
            Multiple Option Selector
        </h1>
        <img :src="require(`@/assets/tutorials/general1/openInfo.gif`)">
        <p>
            Click the <u>bottom section</u> of an option to show or close extra information about the option.
        </p>
        <img :src="require(`@/assets/tutorials/general1/selectUnselect.gif`)">
        <p>
            Click or tap the <u>top section</u> of a selected option to unselect and vice-versa.
        </p>
    </div>
</template>

<script>
export default {
    name: "tutorialGeneral1"
}
</script>

<style lang="scss" scoped>
@import "~@/scss/individualStyleSheets/_tutorialStyles.scss"
</style>
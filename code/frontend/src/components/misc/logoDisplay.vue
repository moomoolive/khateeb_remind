<template>
    <div class="logoContainer">
        <img :src="institutionLogo" alt="Overarching Institution Logo" class="left">
        <p style="font-size: 4.5vh; font-weight: bold; margin-top: 2vh;">+</p>
        <img :src="prayerProviderLogo" alt="Friday Prayer Provider Logo" class="right">
      </div>
</template>

<script>
export default {
    name: 'logoDisplay',
    data() {
        return {
            institutionLogo: require('@/assets/uofcLogo.jpg'),
            prayerProviderLogo: require('@/assets/msaUofCLogo.png')
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@/scss/effects/boxShadow.scss";
.logoContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 550px) {
    .logoContainer{
      flex-direction: column;
    }
}

img {
  $imgDimensions: 27vh;
  margin: 1vh 2vh 1vh 2vh;
  height: $imgDimensions;
  width: $imgDimensions;
  border: solid black 0.1vh;
  &.left {
    @include boxShadow("blue");
  }
  &.right {
    @include boxShadow("blue", false)
  }
}
</style>
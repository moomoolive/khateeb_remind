<template>
    <div class="logoContainer">
        <img
          class="left"
          :src="require(`@/assets/logos/${logoLeft}.jpg`)" 
          alt="Overarching Institution Logo"
        >
        <p v-if="logoRight">+</p>
        <img
          v-if="logoRight"
          class="right"
          :src="require(`@/assets/logos/${logoRight}.jpg`)" 
          alt="Friday Prayer Provider Logo"
        >
      </div>
</template>

<script>
export default {
    name: 'logoDisplay',
    props: {
      logoLeft: {
        type: String,
        required: true
      },
      logoRight: {
        type: String,
        required: false
      }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/effects/boxShadow.scss";
.logoContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15vh;
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

p {
  font-size: 4.5vh;
  font-weight: bold;
  margin-top: 2vh;
}
</style>
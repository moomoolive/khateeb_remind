<template>
    <div class="logoContainer">
        <img :src="institutionLogo" alt="Overarching Institution Logo">
        <p style="font-size: 4.5vh; font-weight: bold;">+</p>
        <img :src="prayerProviderLogo" alt="Friday Prayer Provider Logo">
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
}
</style>
<template>
  <div>
      <div class="logoContainer">
        <img :src="institutionLogo" alt="Overarching Institution Logo">
        <p style="font-size: 4.5vh; font-weight: bold;">+</p>
        <img :src="prayerProviderLogo" alt="Friday Prayer Provider Logo">
      </div>
      <div>
        <homepage-schedule />
      </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    homepageSchedule: () => import('../../components/scheduleDisplay/homepageSchedule.vue')
  },
  data() {
    return {
      institutionLogo: require('../../assets/uofcLogo.jpg'),
      prayerProviderLogo: require('../../assets/msaUofCLogo.png'),
      weeklyView: true
    }
  },
  methods: {
    
  },
  created() {
    
  }
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

::v-deep table {
    max-width: 700px;
}

::v-deep th {
  width: 50%;
}
</style>

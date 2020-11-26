<template>
  <div>
      <div class="logoContainer">
        <img :src="institutionLogo" alt="Overarching Institution Logo">
        <p style="font-size: 4.5vh; font-weight: bold;">+</p>
        <img :src="prayerProviderLogo" alt="Friday Prayer Provider Logo">
      </div>
      <div>
        <slider-button
        leftMessage="This Week"
        rightMessage="Monthly"
        @slider-toggled="weeklyView = !weeklyView"
        />
      </div>
      <div>
        <weekly-khateeb-schedule v-if="weeklyView" />
        <monthly-khateeb-schedule v-if="!weeklyView" />
      </div>
  </div>
</template>

<script>
import weeklyKhateebSchedule from '../components/weeklyKhateebSchedule.vue'

export default {
  name: 'Home',
  components: {
    monthlyKhateebSchedule: () => import('../components/monthlyKhateebSchedule.vue'),
    weeklyKhateebSchedule
  },
  data() {
    return {
      institutionLogo: require('../assets/uofcLogo.jpg'),
      prayerProviderLogo: require('../assets/msaUofCLogo.png'),
      weeklyView: true
    }
  },
  methods: {

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

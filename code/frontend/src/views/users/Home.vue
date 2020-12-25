<template>
  <div>
      <div class="logo">
        <logo-display />
      </div>
      <div class="schedule">
        <homepage-schedule />
      </div>
  </div>
</template>

<script>
import logoDisplay from '@/components/misc/logoDisplay.vue'
import homepageSchedule from '@/components/scheduleDisplay/homepageSchedule.vue'

export default {
  name: 'Home',
  components: {
    homepageSchedule,
    logoDisplay
  }
}
</script>

<style lang="scss" scoped>
.logo {
  margin-bottom: 15vh;
}

.schedule {
  $padding: 3vh;
  width: 90%;
  padding-top: $padding;
  padding-bottom: $padding;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(
    to right,
    themeRGBA("blue", 0.5),
    getColor("offWhite")
  );
}
</style>

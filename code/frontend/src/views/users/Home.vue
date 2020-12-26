<template>
  <div>
      <div class="logo">
        <logo-display />
      </div>
      <div class="gradient1" v-show="scheduleExists">
        <homepage-schedule @schedule="scheduleExists = $event"/>
      </div>
      <msg-with-pic
        msg="It should be up soon insha'Allah"
        gif="flyingPlanes"
        title="This month's schedule hasn't been created yet"
        v-if="!scheduleExists"
      />
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
  },
  data() {
    return {
      scheduleExists: true
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  margin-bottom: 15vh;
}
@import '~@/scss/miscStyles/gradientBackgrounds.scss';
@include gradient1("blue");
</style>

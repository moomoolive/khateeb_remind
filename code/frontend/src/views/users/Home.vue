<template>
  <div>
      <div>
        <logo-display />
      </div>
      <div>
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

</style>

<template>
  <div>
      <div class="logo">
        <logo-display />
      </div>
      <schedule-renderer
        :type="`user`"
        :currentSchedule="currentSchedule"
        v-if="scheduleExists"
      />
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
import scheduleRenderer from '@/components/appBuildingBlocks/schedules/scheduleRenderer.vue'

export default {
  name: 'Home',
  components: {
    scheduleRenderer,
    logoDisplay
  },
  data() {
    return {
      scheduleExists: true,
      currentSchedule: null
    }
  },
  methods: {
    async getSchedule() {
      const monthlySchedule = await this.$API.users.monthlySchedule()
      if (!monthlySchedule || monthlySchedule === `This month's schedule hasn't been created yet`) {
          this.scheduleExists = false
      } else {
          this.currentSchedule = monthlySchedule
      }
    }
  },
  created() {
    this.getSchedule()
  }
}
</script>

<style lang="scss" scoped>
.logo {
  margin-bottom: 15vh;
}
</style>

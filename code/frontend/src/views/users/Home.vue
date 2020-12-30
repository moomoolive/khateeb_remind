<template>
  <div>
      <logo-display
        class="logo"
        :logoLeft="`uofcLogo`"
        :logoRight="`msaUofCLogo`"
      />
      <Schedule
        v-if="scheduleExists && currentSchedule"
        :type="`user`"
        :currentSchedule="currentSchedule"
      />
      <msg-with-pic
        v-if="!scheduleExists"
        msg="It should be up soon insha'Allah"
        gif="flyingPlanes"
        title="This month's schedule hasn't been created yet"
      />
      <loading-screen v-if="!currentSchedule && scheduleExists" />
  </div>
</template>

<script>
import logoDisplay from '@/components/misc/logoDisplay.vue'
import Schedule from '@/components/schedules/scheduleRenderer.vue'
import loadingScreen from '@/components/misc/loadingScreen.vue'

export default {
  name: 'Home',
  components: {
    Schedule,
    logoDisplay,
    loadingScreen
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
</style>

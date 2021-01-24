<template>
  <div>
      <logo-display
        class="logo"
        :logoLeft="`logo1`"
        :logoRight="`logo2`"
      />
      <user-schedule
        v-if="scheduleExists"
        :currentSchedule="currentSchedule"
      />
      <msg-with-pic
        v-if="!scheduleExists"
        msg="It should be up soon insha'Allah"
        gif="flyingPlanes"
        title="This month's schedule hasn't been created yet"
      />
  </div>
</template>

<script>
import userSchedule from '@/components/schedules/templates/user.vue'
import logoDisplay from '@/components/misc/logoDisplay.vue'
import Schedule from '@/components/schedules/scheduleRenderer.vue'

export default {
  name: 'Home',
  components: {
    userSchedule,
    logoDisplay,
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

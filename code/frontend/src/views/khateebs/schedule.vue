<template>
  <div>
      <logo-display
        class="logo"
        :logoLeft="`logo1`"
        :logoRight="`logo2`"
      />
      <khateeb-schedule
        v-if="currentSchedule"
        :reciever="`khateeb`"
        :data="currentSchedule"
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
import logoDisplay from '@/components/misc/logoDisplay.vue'
import khateebSchedule from '@/components/schedules/khateebSchedule.vue'

export default {
  name: 'Home',
  components: {
    khateebSchedule,
    logoDisplay
  },
  data() {
    return {
      scheduleExists: true,
      currentSchedule: {
                isThisADummyValue: true
            }
    }
  },
  methods: {
    async getSchedule() {
      try {
        const monthlySchedule = await this.$API.khateeb.getCurrentSchedule()
        if (monthlySchedule === `non-existent`)
            this.scheduleExists = false
        else 
            this.currentSchedule = monthlySchedule
        console.log(this.currentSchedule)
      } catch(err) {
        this.scheduleExists = false
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

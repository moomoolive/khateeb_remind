<template>
  <div>
    
    <logo-display
      class="logo"
      :logoLeft="`logo1`"
      :logoRight="`logo2`"
    />

    <monthly-jummah-schedule 
        :jummahs="jummahs"
        :locations="locations"
        :timings="timings"
        :khateebs="khateebs"
        :reciever="`khateeb`"
        @request-jummahs="requestJummahs($event)"
    />

  </div>
</template>

<script>
import logoDisplay from '@/components/misc/logoDisplay.vue'
import monthlyJummahSchedule from '@/components/schedules/monthlyJummahSchedule/main.vue'

export default {
  name: 'Home',
  components: {
    monthlyJummahSchedule,
    logoDisplay,
  },
  data() {
      return {
          jummahs: [],
          locations: [],
          timings: [],
          khateebs: []
      }
  },
  methods: {
      async getScheduleBuildingBlocks() {
        const [locations, timings, khateebs] = await this.$API.chainedRequests.getScheduleComponents()
        this.locations = locations
        this.timings = timings
        this.khateebs = khateebs
      },
      async requestJummahs(jummahDateRange={}) {
        this.jummahs = await this.$API.jummahs.getJummahs({ date: jummahDateRange })
      }
      
  },
  created() {
      this.getScheduleBuildingBlocks()
  }
}
</script>

<style lang="scss" scoped>
</style>

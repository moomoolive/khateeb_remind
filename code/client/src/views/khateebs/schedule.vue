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
        @khateeb-signup="khateebSignup($event)"
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
          khateebs: [],
          institutionSettings: {}
      }
  },
  methods: {
      async getScheduleBuildingBlocks() {
        const [locations, timings, khateebs, { settings }] = await this.$API.chainedRequests.getScheduleComponents()
        this.locations = locations
        this.timings = timings
        this.khateebs = khateebs
        this.institutionSettings = settings
      },
      async requestJummahs(jummahDateRange={}) {
        this.jummahs = await this.$API.jummahs.getJummahs({ date: jummahDateRange })
      },
      async khateebSignup(newJummahPreference={}) {
        if (!this.institutionSettings.allowJummahSignup)
          return this.utils.alert(`Unfortunately your administrator has not allowed jummah signups! If you want this feature please talk to your administrator.`)
        const newPreference = await this.$API.jummahs.createNewPreference(newJummahPreference)
        if (Object.keys(newPreference).length > 0)
          this.jummahs.push(newPreference)
      }
  },
  created() {
      this.getScheduleBuildingBlocks()
  }
}
</script>

<style lang="scss" scoped>
</style>

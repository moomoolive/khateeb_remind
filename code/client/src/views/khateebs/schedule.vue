<template>
  <div>

    <monthly-jummah-schedule 
        :jummahs="jummahs"
        :locations="locations"
        :timings="timings"
        :khateebs="khateebs"
        :reciever="`khateeb`"
        @request-jummahs="requestJummahs($event)"
        @khateeb-signup="khateebSignup($event)"
    >
      <template #above-controls>
        
        <div :class="`institution-photo-container`">
          <img :src="imgSrc" class="institution-logo-frame" alt="institution logo">
        </div>

        <div v-if="!customLogoExists" class="institution-description">
          {{ $store.state.user.institution.name }}
        </div>

        <div class="institution-description">
          Khateebs
        </div>

      </template>
    </monthly-jummah-schedule>

  </div>
</template>

<script>
import monthlyJummahSchedule from '@/components/schedules/monthlyJummahSchedule/main.vue'

export default {
  name: 'Home',
  components: {
    monthlyJummahSchedule,
  },
  data() {
      return {
          jummahs: [],
          locations: [],
          timings: [],
          khateebs: [],
          institutionSettings: {},
          imgSrc: require('@/assets/gifs/loading-alternate.gif')
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
      },
      async getInstitutionLogo() {
          this.imgSrc = await this.$API.logos.getInstitutionLogo(
              { institutionID: this.$store.state.user.institution._id }
          )
      },
  },
  computed: {
    customLogoExists() {
      return this.imgSrc !== require('@/assets/logos/genericInstitution.png')
    }
  },
  mounted() {
    this.$nextTick(() => {
      const oneSecondInMilliseconds = 1_000
      window.setTimeout(() => this.getInstitutionLogo(), oneSecondInMilliseconds)
    })
  },
  created() {
    this.getScheduleBuildingBlocks()
  }
}
</script>

<style lang="scss" scoped>

.institution-photo-container {
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-bottom: 30px;
    margin-top: 30px;
}

.institution-logo-frame {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    border: getColor("yellow") solid 3px;
}

.institution-description {
  font-size: 25px;
  color: getColor("offWhite");
  margin-bottom: 20px;
}


@media screen and (max-width: $phoneWidth) {
  .institution-description {
    font-size: 20px;
  }   
}
</style>

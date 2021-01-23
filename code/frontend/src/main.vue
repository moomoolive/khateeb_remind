<template>
  <div id="app">
    <Header class="header" />
    <transition name="dropdown">
      <notifications v-if="showNotification" class="notifications" />
    </transition>
    <router-view class="displayedPage"/>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/misc/Header.vue'
import Footer from '@/components/misc/Footer.vue'
import notifications from '@/components/userInterface/components/notifications/main.vue'

import datetime from '@/utils/dateTime/main.js'

import axios from 'axios'

export default {
  components: {
    Header,
    Footer,
    notifications
  },
  methods: {
    getDateInformation() {
      const info = {
        upcomingFridayInfo: datetime.upcomingFriday()
      }
      this.$store.dispatch('dateInfo', info)
    },
    setJWT() {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['authorization'] = token
      }
    },
    setLastVisit() {
      const dateOfLastVisit = localStorage.getItem('today')
      if (dateOfLastVisit) this.updateLastVisit(dateOfLastVisit)
      const dateToday = new Date().toUTCString()
      localStorage.setItem('today', dateToday)
    },
    updateLastVisit(cachedDate) {
      localStorage.setItem('lastVisit', cachedDate)
      const parsedLastVisit = new Date(cachedDate)
      this.$store.dispatch('setLastVisit', cachedDate)
    }
  },
  computed: {
    showNotification() {
      return this.$store.state.notifications.show
    }
  },
  created() {
    this.setJWT()
    this.getDateInformation()
    this.setLastVisit()
  }
}
</script>

<style lang="scss">
@import '~@/scss/App/index.scss';
</style>

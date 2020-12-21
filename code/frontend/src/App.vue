<template>
  <div id="app">
    <Header/>
    <router-view class="displayedPage"/>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

import datetime from './utils/datetime.js'

import axios from 'axios'

export default {
  components: {
    Header,
    Footer
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
  created() {
    this.setJWT()
    this.getDateInformation()
    this.setLastVisit()
  }
}
</script>

<style lang="scss">
@import '~@/scss/styleSheets/App.scss';
</style>

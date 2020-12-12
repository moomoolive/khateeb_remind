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
        currentDateInfo: datetime.currentDate(),
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.displayedPage {
  $padding: 9%;
  background-color: #fffff4;
  padding-bottom: 5%;
  padding-top: 9% !important;
  max-width: 1000px;
  margin: auto;
}

div {
  height: 100%;
  width: 100%;
}

img {
  min-width: 0px;
  min-height: 0px;
}

body {
  margin: 0 0 0 0;
  background-color: #333;
}
</style>

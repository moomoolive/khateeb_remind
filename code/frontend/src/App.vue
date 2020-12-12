<template>
  <div id="app">
    <Header />
    <router-view class="displayedPage"/>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

import datetime from './utils/datetime.js'
import API from './utils/apiCalls.js'

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
      const date = localStorage.getItem('lastVisit')
      const parsedDate = new Date(date)
      this.$store.dispatch('setLastVisit', parsedDate)
    }
  },
  created() {
    this.setJWT()
    this.getDateInformation()
    this.setLastVisit()
  },
  beforeDestroy() {
    localStorage.setItem('lastVisit', new Date())
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
  background-color: #fffff4;
  padding-bottom: 5%;
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
  margin-top: 8%;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  background-color: #333;
}
</style>

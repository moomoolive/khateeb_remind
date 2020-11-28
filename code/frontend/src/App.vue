<template>
  <div id="app">
    <Header />
    <router-view/>
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
    async getKhateebData() {
      const monthlySchedule = await API.monthlySchedule()
      this.$store.dispatch('khateebScheduleInfo', monthlySchedule)
    }
  },
  created() {
    this.getDateInformation()
    this.getKhateebData()
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
}
</style>

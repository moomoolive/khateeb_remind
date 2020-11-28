<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import datetime from './utils/datetime.js'

import axios from 'axios'

export default {
  components: {
    Header
  },
  methods: {
    getDateInformation() {
      const info = {
        currentDateInfo: datetime.currentDate(),
        upcomingFridayInfo: datetime.upcomingFriday()
      }
      this.$store.dispatch('dateInfo', info)
    },
    getKhateebData() {
      // should be cached data ==> perhaps cached from every week saturday
      const API_SERVER = process.env.VUE_APP_API_SERVER_URL || 'http://localhost:5000'
      axios.post(API_SERVER + '/')
        .then((response) => {
            this.$store.dispatch('khateebScheduleInfo', response.data)
          })
        .catch((error) => { console.log(error) })
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

table, th, td {
  border: 1px solid black;
}

table {
    margin-left: auto;
    margin-right: auto;
}
</style>

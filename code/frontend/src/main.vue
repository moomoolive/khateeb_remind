<template>
  <div id="app">
    <Header class="header" />
    <transition name="dropdown">
      <notifications v-if="showNotification" class="notifications notifications-size-position" />
    </transition>
    <router-view class="displayed-page page-padding"/>
  </div>
</template>

<script>
import Header from '@/components/misc/Header.vue'
import notifications from '@/components/userInterface/components/notifications/main.vue'

import datetime from '@/utils/dateTime/main.js'

import axios from 'axios'

export default {
  components: {
    Header,
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

.displayed-page {
    position: relative;
    z-index: 0;
    background-color: getColor("offWhite");
    margin: auto;
    background-image: url('~@/assets/wallpaper/app.jpg');
    min-height: 70vh;
}

.page-padding {
  padding-bottom: 60px;
  padding-top: 100px !important;
}

.header {
    overflow: hidden;
    position: fixed;
    z-index: 10;
}

.notifications {
    position: fixed;
    z-index: 9;
    overflow: hidden;
    border-radius: 4px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 20%;
}

.notifications-size-position {
  height: 300px;
  width: 300px;
  font-size: 17px;
}

@media screen and (max-width: $phoneWidth) {
      .notifications-size-position {
        width: 70%;
        height: 35vh;
        font-size: 2vh;
      }
      .page-padding {
        padding-bottom: 5%;
        padding-top: 13% !important;
      }
}
</style>

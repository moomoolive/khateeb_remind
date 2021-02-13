<template>
  <div id="app">
    <div class="header">
      <website-banner v-if="siteBanner.show" />
      <Header />
    </div>
    <div class="notifications-layer" v-if="showNotification">
      <transition name="dropdown">
        <notifications 
          v-if="showNotificationDisplay" 
          class="notifications notifications-size-position"
          ref="note" 
        />
      </transition>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view :class="`displayed-page page-padding ${wallpaper}`"/>
    </transition>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/misc/Header.vue'
import notifications from '@/components/userInterface/components/notifications/main.vue'
import Footer from '@/components/misc/Footer.vue'
import websiteBanner from '@/components/misc/websiteBanner.vue'

import axios from 'axios'

export default {
  components: {
    Header,
    notifications,
    Footer,
    websiteBanner
  },
  data() {
    return {
      firstNotification: true,
      showNotificationDisplay: false
    }
  },
  methods: {
    async setJWT() {
      let token = localStorage.getItem('token')
      if (!token)
        return false
      axios.defaults.headers.common['authorization'] = token
      try {
        const userPackage = await this.$API.user.checkIn()
        this.$API.utils.assignUserPackage(userPackage)
      } catch(err) {
        console.log(err)
      }
      return true
    },
    setLastVisit() {
      const dateOfLastVisit = localStorage.getItem('today')
      if (dateOfLastVisit) 
        this.updateLastVisit(dateOfLastVisit)
      const dateToday = new Date().toUTCString()
      localStorage.setItem('today', dateToday)
    },
    updateLastVisit(cachedDate) {
      localStorage.setItem('lastVisit', cachedDate)
      const parsedLastVisit = new Date(cachedDate)
      this.$store.dispatch('setLastVisit', cachedDate)
    },
    siteBannerHasContent() {
      const friday = 5
      const today = new Date()
      return true//today.getDay() === friday
    }
  },
  computed: {
    showNotification() {
      return this.$store.state.notifications.show
    },
    wallpaper() {
      return this.$store.state.wallpaper
    },
    notificationsQueue() {
      return this.$store.state.notificationsQueue
    },
    userPromptedNotifications() {
      return this.$store.state.userPromptedNotifications
    },
    siteBanner() {
      return this.$store.state.siteBanner
    },
    userIsLoggedIn() {
      return this.$store.getters.isJWTValid
    }
  },
  watch: {
    userIsLoggedIn(newVal) {
      if (newVal && this.siteBannerHasContent())
        this.$store.dispatch("showSiteBanner")
    },
    showNotification(newVal) {
      const time = 50
      if (newVal)
        window.setTimeout(() => { this.showNotificationDisplay = true }, time)
      else
        window.setTimeout(() => { this.showNotificationDisplay = false }, time)
    },
    notificationsQueue(newVal) {
      if (newVal.length < 1) {
        this.firstNotification = true
        return
      }
      else if (newVal[0] === '__USER__') {
        newVal[0] = this.userPromptedNotifications[0]
      }
      const milliseconds = this.firstNotification ? 100 : 2_500
      if (this.firstNotification)
        this.firstNotification = false
      const upcomingNotification = newVal[0]
      window.setTimeout(() => 
        { this.$store.dispatch('displayNotification', upcomingNotification) }
        , milliseconds
      )
    }
  },
  created() {
    const JWTwasSet = this.setJWT()
    this.setLastVisit()
    if (JWTwasSet && this.siteBannerHasContent())
      this.$store.dispatch("showSiteBanner")
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
    margin: 0 0 0 0;
    background-color: getColor("grey");
}

h2 {
    font-size: 3.2vh;
    padding-left: 0.4vw;
    padding-right: 0.4vw;
}

.displayed-page {
    position: relative;
    z-index: 0;
    background-image: url('~@/assets/wallpaper/app.jpg');
    background-color: getColor("offWhite");
    margin: auto;
    min-height: 76vh;
    &.main {
      background-image: url('~@/assets/wallpaper/app.jpg');
    }
    &.user {
      background-image: url('~@/assets/wallpaper/user.png');
    }
    &.sysAdmin {
      background-image: url('~@/assets/wallpaper/sysAdmin.jpg');
    }
    &.institutionAdmin {
      background-image: url('~@/assets/wallpaper/institutionAdmin.jpg');
    }
}

.page-padding {
  padding-bottom: 60px;
  padding-top: 100px !important;
}

.header {
    overflow: visible;
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    height: auto;
}

.notifications {
    position: relative;
    z-index: 9;
    overflow: hidden;
    border-radius: 4px;
    bottom: 5%;
}

.notifications-layer {
  z-index: 9;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-size-position {
  width: 80%;
  height: auto;
  max-height: 400px;
  max-width: 400px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
}

@media screen and (max-width: $phoneWidth) {
      .page-padding {
        padding-bottom: 5%;
        padding-top: 13% !important;
      }
}

@mixin color($color) {
    background-color: getColor($color);
    &:hover{ border: 0.1vh solid getColor($color); }
}

@mixin allColors($list: $themeColors) {
    @each $colorName, $color in $list {
        &.#{$colorName} { @include color($colorName); }
    }
}

button {
    background-color: getColor("green");
    border: none;
    border-radius: 4px;
    color: white;
    padding: 1vh 2vh;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 2vh;
    transition-duration: 0.4s;
    outline: none;

    $marginOne: 1vh;
    margin: $marginOne $marginOne $marginOne $marginOne;
    &:hover {
      background-color: white !important;
      color: black !important;
      border: 0.1vh solid getColor("green");
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    &:focus { @include blinkingAnimation(); }
    @include allColors();
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.4s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>

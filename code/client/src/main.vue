<template>
  <div id="app">
    
    <div class="big-app-background"></div>

    <div 
      v-show="$store.state.notifications.display.show" 
      class="notifications-layer"
    >
      <transition name="dropdown">
        <notifications 
          v-if="showNotificationDisplay" 
          class="notifications notifications-size-position"
        />
      </transition>
    </div>

    <div class="app-container">
      <div class="header">

        <collapse-transition>
          <website-banner v-show="$store.state.websiteBanner.show" />
        </collapse-transition>

        <header-navigation />

      </div>

      <div :class="`main-content-background`">
        <div class="sticky">
          <div class="bubbles">
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
          </div>
        </div>

        <vue-page-transition name="fade-in-down">
          <router-view 
            :class="`displayed-page page-padding`"
          />
        </vue-page-transition>
      </div>

      <request-manager />
      <notifications-manager @toggle-notification-display="toggleNotificationDisplay()" />

      <collapse-transition :duration="600">
          <footer-popup
            v-show="$store.state.footerPopup.show"
            class="footer-popup" 
          />
      </collapse-transition>

      <Footer />

    </div>
  </div>
</template>

<script>
import notifications from '@/components/notifications/main.vue'
import Footer from '@/components/footer/main.vue'
import websiteBanner from '@/components/header/websiteBanner.vue'
import notificationsManager from '@/components/notifications/notificationsManger.vue'
import headerNavigation from '@/components/header/navigation/main.vue'
import requestManager from '@/components/misc/requestManager.vue'
import footerPopup from '@/components/footer/popup/main.vue'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import pwaHelpers from './libraries/pwa/main.js'
import localStorageHelpers from './libraries/localStorageManagement/main.js'

import { nanoid } from 'nanoid'

export default {
  components: {
    notifications,
    Footer,
    websiteBanner,
    CollapseTransition,
    notificationsManager,
    headerNavigation,
    requestManager,
    footerPopup,
  },
  data() {
    return {
      showNotificationDisplay: false,
      isOffline: false
    }
  },
  methods: {
    async setJWT() {
      let token = localStorage.getItem('token')
      if (token)
        this.$store.dispatch('user/updateToken', token)
    },
    setDeviceId() {
      if (!localStorageHelpers.get("deviceId"))
        localStorageHelpers.commit("deviceId", nanoid(24))
    },
    toggleNotificationDisplay() {
      this.showNotificationDisplay = !this.showNotificationDisplay
    },
    async signUserUpForPushNotifications() {
      const serviceWorkerReg = await pwaHelpers.getServiceWorkerRegistration()
      if (serviceWorkerReg) {
        const pushSub = await pwaHelpers.subscribeUserToPushNotifications(serviceWorkerReg)
        if (!pushSub)
          return
        const resCode = await this._api.pwa.createPWASubscription(pushSub)
        return resCode
      } 
    },
    setFirstLogin() {
      if (!localStorageHelpers.get("hasLoggedInOnce"))
        localStorageHelpers.commit("hasLoggedInOnce", true)
    },
    async executePushNotificationWorkflow() {
      const res = await this.signUserUpForPushNotifications()
      if (res === 0)
        localStorageHelpers.commit("recievingPushNotifications", true)
    },
    isFirstLogin() {
      return this.isLoggedIn && !localStorageHelpers.get("hasLoggedInOnce")
    },
    hasNotSignedUpForPushNotificationsYet() {
      return this.isLoggedIn && !localStorageHelpers.get("recievingPushNotifications")
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['user/isLoggedIn']
    },
    userType() {
      return this.$store.getters['user/type'] 
    },
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal)
        this.setFirstLogin()
      if (this.isFirstLogin() || this.hasNotSignedUpForPushNotificationsYet())
        this.executePushNotificationWorkflow()
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (this.$store.getters['user/isLoggedIn']) {
        this._api.user.getNotifications()
      }
    })
  },
  created() {
    this.setJWT()
    this.setDeviceId()
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
    overflow-x: hidden;
}

.app-container {
  max-width: $maxAppWidth;
  min-width: $minimumAppWidth;
  @include centerMargin();
  @include floatingBoxShadow(0.6);
}

.main-content-background {

  background: getColor("blue");
  overflow: hidden !important;
}

@keyframes rise{
  0%{
    bottom:-100px;
    transform:translateX(0);
  }
  50%{
    transform:translate(100px);
  }
  100%{
    bottom:1080px;
    transform:translateX(-200px);
  }
}

.sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bubbles{
  position:absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top:0;
  left:0;
}

.bubble{
  position: absolute;
  bottom:-100px;
  width:40px;
  height: 40px;
  background:#f1f1f1;
  border-radius:50%;
  opacity:0.5;
  animation: rise 10s infinite ease-in;
}

.bubble:nth-child(1){
  width:40px;
  height:40px;
  left:10%;
  animation-duration:8s;
}

.bubble:nth-child(2){
  width:20px;
  height:20px;
  left:20%;
  animation-duration:5s;
  animation-delay:1s;
}

.bubble:nth-child(3){
  width:50px;
  height:50px;
  left:35%;
  animation-duration:7s;
  animation-delay:2s;
}

.bubble:nth-child(4){
  width:80px;
  height:80px;
  left:50%;
  animation-duration:11s;
  animation-delay:0s;
}

.bubble:nth-child(5){
  width:35px;
  height:35px;
  left:55%;
  animation-duration:6s;
  animation-delay:1s;
}

.bubble:nth-child(6){
  width:45px;
  height:45px;
  left:65%;
  animation-duration:8s;
  animation-delay:3s;
}

.bubble:nth-child(7){
  width:90px;
  height:90px;
  left:70%;
  animation-duration:12s;
  animation-delay:2s;
}

.bubble:nth-child(8){
  width:25px;
  height:25px;
  left:80%;
  animation-duration:6s;
  animation-delay:2s;
}

.bubble:nth-child(9){
  width:15px;
  height:15px;
  left:70%;
  animation-duration:5s;
  animation-delay:1s;
}
.bubble:nth-child(10){
  width:90px;
  height:90px;
  left:25%;
  animation-duration:10s;
  animation-delay:4s;
}

.displayed-page {
    position: relative;
    z-index: 0;
    margin: auto;
    min-height: 76vh;
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
    @include lightBorderRounding();
    bottom: 5%;
}

.footer-popup {
  z-index: 9;
  position: fixed;
  bottom: 30px;
  right: 10px;
  max-width: 200px;
  max-height: 300px;
  padding: 7px 4px 7px 4px;
  border-radius: 7px;
  @include floatingBoxShadow(0.4);
}

.notifications-layer {
  z-index: 9;
  position: fixed;
  background: themeRGBA('grey', 0.3);
  width: 100vw;
  height: 100vh;
  min-width: $minimumAppWidth;
  @include flexboxDefault();
}

.notifications-size-position {
  width: 80%;
  height: auto;
  max-height: 400px;
  max-width: 400px;
  @include floatingBoxShadow(0.4);
}

.big-app-background {
  background: getColor("green");
  height: 250px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -2;
}

@media screen and (max-width: $phoneWidth) {
      .page-padding {
        padding-bottom: 5%;
        padding-top: 13% !important;
      }
}

@media screen and (min-width: $maxAppWidth) {
    .app-container {
      margin-top: 50px;
      margin-bottom: 50px;
    }
}
</style>

<template>
  <div id="app">

    <div class="header">

      <collapse-transition>
        <website-banner v-show="$store.state.websiteBanner.show" />
      </collapse-transition>

      <header-navigation />

    </div>

    <div v-show="$store.state.notifications.display.show" class="notifications-layer">
      <transition name="dropdown">
        <notifications 
          v-if="showNotificationDisplay" 
          class="notifications notifications-size-position"
        />
      </transition>
    </div>

    <transition
      name="fade"
      mode="out-in"
    >
      <router-view 
        :class="`displayed-page page-padding ${$store.state.app.wallpaper}`"
      />
    </transition>

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
        const resCode = await this.$API.pwa.createPWASubscription(pushSub)
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
      if (this.$store.getters['user/isLoggedIn'])
        await this.$API.user.checkIn()
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
    min-width: $minimumAppWidth;
}

.displayed-page {
    position: relative;
    z-index: 0;
    background-image: url('~@/assets/wallpaper/app.jpg');
    background-color: getColor("blue");
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

    &.homepage {
      background-image: url('~@/assets/misc/insideMasjid.jpg');
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

@media screen and (max-width: $phoneWidth) {
      .page-padding {
        padding-bottom: 5%;
        padding-top: 13% !important;
      }
}
</style>

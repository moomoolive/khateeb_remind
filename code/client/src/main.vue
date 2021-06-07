<template>
  <div id="app">
    
    <!-- the green streak on wide display -->
    <div class="big-app-background"></div>

    <!-- the khateeb remind logo seen in the large screen display -->
    <fa-icon class="large-display-background-logo" :icon="['far', 'paper-plane']" />

    <!-- popup notifications -->
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

    <!-- the actual app -->
    <div class="app-container-wrapper">

      <!-- 
        an element that fills an awkward gap in header
        on large screen view 
      -->
      <div class="large-screen-header-fill"></div>

      <!-- bubbles background -->
      <default-app-background />

      <div class="app-container">

        <header class="header">

          <collapse-transition>
            <website-banner v-show="$store.state.websiteBanner.show" />
          </collapse-transition>

          <header-navigation />

        </header>

        <!-- main router (displayed page) -->
        <div :class="`main-content-background`">

          <vue-page-transition :name="routerConfig.animationName">
            <router-view :class="`displayed-page page-padding`" />
          </vue-page-transition>

        </div>

        <!-- app runtimes -->
        <request-manager />

        <notifications-manager @toggle-notification-display="toggleNotificationDisplay()" />

        <!-- footer popup messages -->
        <collapse-transition :duration="600">
            <footer-popup
              v-show="$store.state.footerPopup.show"
              class="footer-popup" 
            />
        </collapse-transition>

        <footer>
          <Footer />
        </footer>

      </div>
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
import defaultAppBackground from '@/components/misc/appBackground.vue'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import pwaHelpers from './libraries/pwa/main.js'
import localStorageHelpers from './libraries/localStorageManagement/main.js'

import { nanoid } from 'nanoid'

import Config from '$config'

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
    defaultAppBackground
  },
  data() {
    return {
      showNotificationDisplay: false,
      isOffline: false,
      routerConfig: Config.routerConfig
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
@import '~@/scss/_global-styles.scss';

#app {
    font-family: 'Oxygen', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: get-color("grey");
    overflow-x: hidden;
    background: get-color("silver");
}

.big-app-background {
  background: get-color("green");
  height: 97px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}

.large-display-background-logo {
  position: absolute;
  bottom: 20px;
  right: 150px;
  font-size: 90px;
  color: get-color("green");
}

.app-container {
  max-width: $large-screen-view;
  min-width: $minimum-app-width;
  @include center-margin();
  @include floating-box-shadow(0.6);
  position: relative;
  z-index: 1;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.main-content-background {
  overflow: hidden !important;
  position: relative;
  z-index: 1;
  width: 100%;
}

.displayed-page {
    position: relative;
    z-index: 1;
    min-height: 74vh;
}

.page-padding {
  padding-bottom: 100px !important;
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
    @include light-border-rounding();
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
  @include floating-box-shadow(0.4);
}

.notifications-layer {
  z-index: 9;
  position: fixed;
  background: get-color('grey', 0.3);
  width: 100vw;
  height: 100vh;
  min-width: $minimum-app-width;
  @include flexbox-default();
}

.notifications-size-position {
  width: 80%;
  height: auto;
  max-height: 400px;
  max-width: 400px;
  @include floating-box-shadow(0.4);
}

.app-container-wrapper {
  background: get-color('blue');
  max-width: $maxAppWidth + 50px;
  @include center-margin();
  position: relative;
  z-index: 1;
}

.large-screen-header-fill {
  display: none;
}

@media screen and (max-width: $phone-width) {
      .page-padding {
        padding-bottom: 75px !important;
        padding-top: 75px !important;
      }

      .displayed-page {
          position: relative;
          z-index: 0;
          margin: auto;
          min-height: 495px;
      }
}

@media screen and (min-width: $large-screen-view) {
    .app-container {
      margin-top: 50px;
      margin-bottom: 50px;
      width: $maxAppWidth;
      height: 90vh;
    }

    .app-container-wrapper {
      max-width: $maxAppWidth;
    }

    #app {
      overflow: hidden;
    }

    .header {
        position: sticky;
    }

    .large-screen-header-fill {
      position: absolute;
      z-index: 10;
      height: 47px;
      background-color: get-color("grey", 0.5);
      display: block;
      right: 0;
      width: 12px;
    }
}
</style>

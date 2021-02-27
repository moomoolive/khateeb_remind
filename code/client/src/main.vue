<template>
  <div id="app">
    <div class="header">
      <collapse-transition>
        <website-banner v-show="$store.state.websiteBanner.show" />
      </collapse-transition>
      <header-navigation />
    </div>
    <notifications-manager 
      @toggle-notification-display="toggleNotificationDisplay()"
    />
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
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view 
        :class="`displayed-page page-padding ${$store.state.app.wallpaper}`"
      />
    </transition>
    <request-manager />
    <tutorial-prompter
      :tutorials="gettingStartedGuide"
    />
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
import tutorialPrompter from '@/components/notifications/tutorialPrompter.vue'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
  components: {
    notifications,
    Footer,
    websiteBanner,
    CollapseTransition,
    notificationsManager,
    headerNavigation,
    requestManager,
    tutorialPrompter
  },
  data() {
    return {
      showNotificationDisplay: false
    }
  },
  methods: {
    async setJWT() {
      let token = localStorage.getItem('token')
      if (token)
        this.$store.dispatch('user/updateToken', token)
    },
    toggleNotificationDisplay() {
      this.showNotificationDisplay = !this.showNotificationDisplay
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['user/isLoggedIn']
    },
    userType() {
      return this.$store.getters['user/type'] 
    },
    gettingStartedGuide() {
      if (this.isLoggedIn && this.userType === 'khateeb') {
        return [{ category: 'khateebs', number: 1 }]
      }
      else 
        return []
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
    min-width: 350px;
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
  background: themeRGBA('grey', 0.3);
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
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

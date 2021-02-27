<template>
      <div class="topnav">
        <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
            @click="_.toHomePage()"
        >
        <div>
          <div v-if="!$store.getters['user/isLoggedIn']">
            <button class="blue" @click="redirect('/')">Log In</button>
            <button class="green" @click="signUp()">Sign Up</button>
          </div>
          <div v-else>
            <img 
              :src="require('@/assets/nav/menu.svg')"
              @click="openNavMenu()" 
              :class="`menu-icon-container ${activeMenu ? 'active-menu' : ''}`"
            >
            <notification-icon 
              class="notifications"
              @close-nav="closeMenu()"
            />
            <collapse-transition :duration="600">
                <navigation-options 
                  v-show="activeMenu" 
                  class="menu-container"
                  @close-nav="closeMenu()"
                  @redirect="redirect($event)"
                />
            </collapse-transition>
          </div>
        </div>
      </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import notificationIcon from './components/notificationIcon.vue'
import navigationOptions from './components/navigationOptions.vue'
import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    name: 'headerNavigation',
    components: {
      CollapseTransition,
      notificationIcon,
      navigationOptions
    },
    data() {
      return {
        activeMenu: false
      }
    },
    methods: {
      closeMenu() {
        this.activeMenu = false
      },
      openNavMenu() {
        if (this.$store.state.notifications.display.show)
          this.$store.commit('notifications/close')
        this.activeMenu = !this.activeMenu
      },
      redirect(path) {
        if (path !== this.$router.currentRoute.fullPath)
          this.$router.push(path)
        this.activeMenu = false
      },
      signUp() {
        const redirections = [
                  { text: 'Khateebs', to: '/create/khateebs' },
                  { text: 'Institutions', to: '/create/institutions' }
              ]
        notificationHelpers.redirectionOptions(redirections)
      },
      logout() {
        this.$store.dispatch('user/logout')
        this.activeMenu = false 
        this.$nextTick(() => { this.$router.push('/') })
      },
    }
}
</script>

<style lang="scss" scoped>
.topnav {
  background-color: themeRGBA("grey", 0.5);
  height: 5vh;
  min-height: 40px;
  max-height: 50px;
  width: 100%;
  overflow: visible;
}

img {
  height: 70%;
  float: left;
  padding: 1vh;
}

.notifications {
  float: right;
  margin-right: 8px;
}

.menu-icon-container {
  position: relative;
  border-radius: 50%;
  height: 50%;
  right: 5px;
  bottom: -6%;
  float: right;
}

.active-menu {
  background: themeRGBA("darkBlue", 0.7);
}

.menu-container {
  position: relative;
  bottom: -100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: 0;
  height: 800%;
}

button {
  float: right;
  font-size: 1.1vh;
  font-weight: bold;
  border-radius: 0;
  color: black;
  height: 60%;
  width: 15%;
  max-width: 110px;
  margin-left: 0;
}

@media screen and (max-width: $phoneWidth) {
      .menu-icon-container {
        right: 1%;
      }
}
</style>
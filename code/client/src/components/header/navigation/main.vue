<template>
  <div>
    <div class="topnav">

        <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
            @click="_utils.toHomePage()"
        >
        
        <collapse-transition :duration="400" :dimension="`width`">
          <div v-show="$store.state.app.isOffline" class="no-wifi">
              <div>
                  <svg 
                  aria-hidden="true" 
                  focusable="false" 
                  data-prefix="fas" 
                  data-icon="wifi" 
                  class="menu-icon svg-inline--fa fa-wifi fa-w-20" 
                  role="img" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 640 512">
                    <path 
                      fill="#f44336" 
                      d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z">
                    </path>
                  </svg>
              </div>
            </div>
        </collapse-transition>

        <div class="right-side-menu">

          <div v-if="!$store.getters['user/isLoggedIn']" class="signup-buttons-container">

            <button 
              class="blue signup-buttons pale-hover" 
              @click="redirect('/login')"
            >
              Log In
            </button>

            <button 
              class="green signup-buttons pale-hover"
              @click="signUp()"
            >
              Sign Up
            </button>
          
          </div>

          <div v-else class="icons-container">

            <notification-icon 
              class="notifications"
              @close-nav="closeMenu()"
            />

            <div>
              <svg 
                aria-hidden="true" 
                focusable="false" 
                data-prefix="far" 
                data-icon="user-circle" 
                class="menu-icon svg-inline--fa fa-user-circle fa-w-16" 
                role="img" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 496 512"
                @click="toggleProfileDetails()"
              >
                  <path 
                    :fill="showProfileDetails ? `#2196F3` : `currentColor`" 
                    d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z">
                  </path>
                </svg>
            </div>

            <div>
              <svg 
                aria-hidden="true" 
                focusable="false" 
                data-prefix="fas" 
                data-icon="bars" 
                class="menu-icon svg-inline--fa fa-bars fa-w-14" 
                role="img" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
                @click="toggleNavMenu()"
              >
                  <path 
                    :fill="activeMenu ? `#2196F3` : `currentColor`" 
                    d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z">
                  </path>
                </svg>
            </div>

          </div> 

        </div>
      </div>

      <collapse-transition :duration="400">
        <navigation-options 
          v-show="activeMenu" 
          class="menu-container"
          :activeMenu="activeMenu"
          @close-nav="closeMenu()"
          @redirect="redirect($event)"
        />
      </collapse-transition>

      <collapse-transition :duration="400" :dimension="`width`">
        <profile-options
          v-show="showProfileDetails" 
          :class="`profile-options`"
          :showProfileDetails="showProfileDetails"
          @close="closeProfileDetails()"
          @redirect="redirect($event)" 
        />
      </collapse-transition>

  </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import notificationIcon from './components/notificationIcon.vue'
import navigationOptions from './components/navigationOptions.vue'
import notificationHelpers from '@/libraries/notifications/main.js'
import profileOptions from './components/profileOptions.vue'

export default {
    name: 'headerNavigation',
    components: {
      CollapseTransition,
      notificationIcon,
      navigationOptions,
      profileOptions
    },
    data() {
      return {
        activeMenu: false,
        showProfileDetails: false
      }
    },
    methods: {
      toggleProfileDetails() {
        this.showProfileDetails = !this.showProfileDetails
      },
      toggleNavMenu() {
        this.activeMenu = !this.activeMenu
      },
      closeProfileDetails() {
        if (this.showProfileDetails)
          this.showProfileDetails = false
      },
      closeMenu() {
        if (this.activeMenu)
          this.activeMenu = false
      },
      closeNotificationScroller() {
        if (this.$store.state.notifications.display.show)
          this.$store.commit('notifications/close')
      },
      closeAllMenus() {
        this.closeMenu()
        this.closeProfileDetails()
        this.closeNotificationScroller()
      },
      redirect(path) {
        if (path !== this.$router.currentRoute.fullPath)
          this.$router.push(path)
        this.closeAllMenus()
      },
      signUp() {
        notificationHelpers.redirectionOptions(
          [
              { text: 'Khateebs', to: '/institution-selection' },
              { text: 'Institutions', to: '/create/institutions' }
          ]
        )
      },
      logout() {
        this.$store.dispatch('user/logout')
        this.closeAllMenus()
      }
    },
    computed: {
        userType() {
            return this.$store.state.user.userInfo.__t
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
  width: 100vw;
  overflow: visible;
  min-width: $minimumAppWidth;
}

.logo {
  height: 35px;
  padding: 5px;
  position: absolute;
  left: 5px;
}

.signup-buttons {
  float: right;
  font-size: 13px;
  font-weight: bold;
  border-radius: 0;
  color: black;
  height: 60%;
  width: 200px;
  height: 30px;
  max-width: 110px;
  @include floatingBoxShadow();
}

.signup-buttons-container {
  margin-right: 15px;
}

.icons-container {
  @include flexboxDefault();
  height: 5vh;
  min-height: 40px;
  max-height: 50px;
  width: 180px;
}

.right-side-menu {
  position: absolute;
  right: 8px;
}

.menu-icon {
  height: 35px;
  margin-left: 10px;
  margin-right: 10px;
}

.no-wifi {
    position: absolute;
    left: 51px;
    @include flexboxDefault();
    height: 5vh;
    min-height: 40px;
    max-height: 50px;
  }

.profile-options {
  max-width: 190px;
  margin-left: auto;
  margin-right: 25px;
  margin-top: 20px;
}

.menu-container {
  max-width: 600px;
  margin-left: auto;
  @include floatingBoxShadow(); 
}

@media screen and (max-width: $phoneWidth) {

      .signup-buttons {
        font-size: 8px;
        width: 60px;
        height: 25px;
      }

      .logo {
        height: 30px;
      }

      .right-side-menu {
        right: 0px;
      }
      
      .menu-icon {
        margin-left: 7px;
        margin-right: 7px;
      }

      .icons-container {
        width: 150px;
      }

      .profile-options {
        right: 32px;
      }

      .no-wifi {
        left: 45px;
      }

      .signup-buttons-container {
        margin-right: 0px;
      }

}
</style>
<template>
  <div>
    <div class="topnav">

        <img 
            class="logo"
            alt="khateeb remind logo" 
            :src="`${pathToPublicFolder}khateebRemind.png`"
            @click="_utils.toHomePage()"
        >

        <collapse-transition :duration="400" :dimension="`width`">
          <div v-show="$store.state.app.isOffline" class="no-wifi">
            <span class="red">
              <fa-icon 
                :icon="['fas', 'wifi']" 
                :class="`menu-icon-svg${showProfileDetails ? ' active' : ''}`"
              />
            </span>
            </div>
        </collapse-transition>

        <div class="right-side-menu">

          <div v-if="!$store.getters['user/isLoggedIn']">
            <nav>
              <button 
                class="blue signup-buttons pale-hover" 
                @click="redirect('/login')"
              >
                Log In
              </button>

              <button 
                class="green signup-buttons pale-hover"
                @click="redirect('/create/user')"
              >
                Sign Up
              </button>
            </nav>
          
          </div>

          <div v-else class="icons-container">

            <notification-icon 
              class="notifications"
              @close-nav="closeMenu()"
            />

            <div>
              <fa-icon 
                :icon="['far', 'user-circle']" 
                :class="`menu-icon-svg${showProfileDetails ? ' active' : ''}`"
                @click="toggleProfileDetails()"
              />
            </div>

            <div>
              <fa-icon 
                icon="bars" 
                :class="`menu-icon-svg${activeMenu ? ' active' : ''}`"
                @click="toggleNavMenu()" 
              />
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
        showProfileDetails: false,
        pathToPublicFolder: process.env.BASE_URL
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
        if (this.showProfileDetails) {
          this.showProfileDetails = false
        }
      },
      closeMenu() {
        if (this.activeMenu) {
          this.activeMenu = false
        }
      },
      closeNotificationScroller() {
        if (this.$store.state.notifications.display.show) {
          this.$store.commit('notifications/close')
        }
      },
      closeAllMenus() {
        this.closeMenu()
        this.closeProfileDetails()
        this.closeNotificationScroller()
      },
      redirect(path) {
        if (path !== this.$router.currentRoute.fullPath) {
          this.$router.push(path)
        }
        this.closeAllMenus()
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
  background-color: get-color("grey", 0.9);
  height: 5vh;
  min-height: 43px;
  max-height: 50px;
  width: 100vw;
  overflow: visible;
  min-width: 220px;
}

.logo {
  height: 35px;
  padding: 5px;
  position: absolute;
  left: 5px;
  @include is-clickable();
}

.signup-buttons {
  float: right;
  font-size: 17px;
  border-radius: 0;
  color: black;
  height: 60%;
  width: 200px;
  height: 30px;
  max-width: 110px;
  @include floating-box-shadow();
}

.icons-container {
  @include flexbox-default();
  height: 5vh;
  min-height: 40px;
  max-height: 50px;
  width: 160px;
}

.right-side-menu {
  position: absolute;
  right: 0px;
}

::v-deep .menu-icon-svg {
  font-size: 35px;
  margin-left: 10px;
  margin-right: 10px;
  @include is-clickable();
  color: get-color("blue");

  &.active {
    color: get-color("green");
  }
}

.no-wifi {
    position: absolute;
    left: 51px;
    @include flexbox-default();
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
  @include floating-box-shadow(); 
}

@media screen and (max-width: $phone-width) {

      .signup-buttons {
        font-size: 14px;
        width: 83px;
        height: 25px;
      }

      .logo {
        height: 30px;
      }

      .right-side-menu {
        right: 0px;
      }

      ::v-deep .menu-icon-svg {
        font-size: 31px;
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

}

@media screen and (min-width: $large-screen-view) {

  .menu-container {
    position: absolute;
    z-index: 8;
    right: 0;
    width: 600px;
  }

  .profile-options {
    position: absolute;
    z-index: 8;
    width: 190px;
    right: 25px;
    top: 40px;
  }

  .right-side-menu {
    display: none;
  }
  
}
</style>
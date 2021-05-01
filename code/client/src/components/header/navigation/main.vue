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
            <span class="red">
              <fa-icon 
                :icon="['fas', 'wifi']" 
                :class="`menu-icon-svg${showProfileDetails ? ' active' : ''}`"
              />
            </span>
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
              @click="redirect('/create/user')"
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

::v-deep .menu-icon-svg {
  font-size: 35px;
  margin-left: 10px;
  margin-right: 10px;

  &.active {
    color: getColor("blue");
  }
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

      .signup-buttons-container {
        margin-right: 0px;
      }

}
</style>
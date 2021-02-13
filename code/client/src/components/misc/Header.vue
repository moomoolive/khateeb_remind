<template>
      <div class="topnav">
        <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
            @click="_.toHomePage()"
        >
        <div>
          <div v-if="!loggedIn">
            <button class="blue" @click="toLogin()">Log In</button>
            <button class="green" @click="signUp()">Sign Up</button>
          </div>
          <div v-else>
            <img 
              :src="require('@/assets/nav/menu.svg')"
              @click="openNavMenu()" 
              :class="`menu-icon-container ${activeMenu ? 'active-menu' : ''}`"
            >
            <svg
              @click="closeNotifications()"
              v-show="showingNotificationScroller"
              aria-hidden="true" 
              focusable="false" 
              data-prefix="fas" 
              data-icon="envelope-open-text" 
              class="notifications svg-inline--fa fa-envelope-open-text fa-w-16" 
              role="img" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
            >
              <path :fill="notificationsIconColor" d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.13c-16.42 0-32.84-5.06-46.86-15.19L0 250.86V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V250.86L302.86 401.94c-14.02 10.12-30.44 15.19-46.86 15.19zm237.61-254.18c-8.85-6.94-17.24-13.47-29.61-22.81V96c0-26.51-21.49-48-48-48h-77.55c-3.04-2.2-5.87-4.26-9.04-6.56C312.6 29.17 279.2-.35 256 0c-23.2-.35-56.59 29.17-73.41 41.44-3.17 2.3-6 4.36-9.04 6.56H96c-26.51 0-48 21.49-48 48v44.14c-12.37 9.33-20.76 15.87-29.61 22.81A47.995 47.995 0 0 0 0 200.72v10.65l96 69.35V96h320v184.72l96-69.35v-10.65c0-14.74-6.78-28.67-18.39-37.77z"></path>
            </svg>
            <svg
              @click="openNotifications()" 
              v-show="!showingNotificationScroller"
              aria-hidden="true" 
              focusable="false" 
              data-prefix="fas" 
              data-icon="envelope" 
              :class="`notifications ${vibrateNotificationsIcon} svg-inline--fa fa-envelope fa-w-16`" 
              role="img" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
            >
              <path :fill="notificationsIconColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path>
            </svg>
            <div v-show="activeMenu" class="menu-container">
              <div v-show="_.authRequirementsSatisfied(1) && !_.authRequirementsSatisfied(4)" class="user-items">
                <div class="menu-item" @click="redirect('/khateeb/')">
                  <p class="top-item">
                    {{ _.authRequirementsSatisfied(2) ? 'Khateeb Schedule' : 'Schedule' }}
                  </p>
                </div>
                <div class="menu-item" @click="redirect('/khateeb/announcements')">
                  <p>Announcements</p>
                </div>
                <div v-if="_.authRequirementsSatisfied(2)" class="menu-item" @click="redirect('/institutionAdmin')">
                  <p>
                    Admin Central
                  </p>
                </div>
              </div>
              <div v-if="_.authRequirementsSatisfied(4)" class="user-items">
                <div class="menu-item" @click="redirect('/sysAdmin')">
                  <p class="top-item">
                    Admin Central
                  </p>
                </div>
                <div class="menu-item" @click="redirect('/root/roaming')">
                  <p class="top-item">
                    Roaming Mode
                  </p>
                </div>
              </div>
              <div class="menu-item" @click="redirect('/user')">
                <p>My Profile</p>
              </div>
              <div class="menu-item get-the-app" @click="downloadApp()">
                <p class="get-the-app-text">
                  Download the App
                </p>
              </div>
              <div class="menu-item caution" @click="logout()">
                <p class="caution-text">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
      return {
        activeMenu: false,
        alertAboutUrgent: false
      }
    },
    methods: {
      openNavMenu() {
        if (this.notificationInfo.show)
          this.closeNotifications()
        this.activeMenu = !this.activeMenu
        
      },
      downloadApp() {
        this._.alert(`This feature is coming soon insha'Allah!`)
      },
      redirect(path) {
        if (path !== this.$router.currentRoute.fullPath)
          this.$router.push(path)
        this.activeMenu = false
      },
      signUp() {
        const info = {
          type: 'redirect',
          options: {
            color: 'green',
            redirections: [
                  {
                      text: 'Khateebs',
                      to: '/create/khateebs'
                  },
                  {
                      text: 'Institutions',
                      to: '/create/institutions'
                  }
              ]
          }
        }
        this.$store.dispatch('createNotification', info)
      },
      toHome() {
        const to = this.$store.getters.decodedJWT ? `/${this.$store.getters.decodedJWT.__t}` : `/`
        if (this.$router.currentRoute.fullPath !== to)
          this.$router.push(to)
      },
      toLogin() {
        if (this.$router.currentRoute.fullPath !== '/')
          this.$router.push('/')
      },
      logout() {
        this.$store.dispatch('logout')
        if (this.$router.currentRoute.fullPath !== '/')
          this.$router.push('/')
        this.activeMenu = false 
      },
      openNotifications() {
        const options = {
          type: 'notificationScroller',
          options: {
            color: 'grey'
          }
        }
        this.$store.dispatch('createNotification', options)
      },
      closeNotifications() {
          this.$store.dispatch('closeNotification')
      },
    },
    computed: {
      loggedIn() {
        return this.$store.getters.tokenExists
      },
      userInfo() {
        return this.$store.getters.decodedJWT
      },
      alertUserAboutUrgentNotifications() {
        return this.alertAboutUrgent && this.$store.getters.urgentNotifications.length > 0
      },
      notificationsIconColor() {
        return this.alertUserAboutUrgentNotifications ? '#F3C620' : '#2196F3' // yellow : blue 
      },
      vibrateNotificationsIcon() {
        return this.alertUserAboutUrgentNotifications > 0 ? 'vibrate' : ''
      },
      notificationInfo() {
        return this.$store.state.notifications
      },
      showingNotificationScroller() {
        return this.notificationInfo.show && this.notificationInfo.type === 'notificationScroller'
      }
    },
    created() {
      const fiveSeconds = 5_000
      window.setTimeout(() => { this.alertAboutUrgent = true }, fiveSeconds)
    }
}
</script>

<style lang="scss" scoped>
img {
  height: 70%;
  float: left;
  padding: 1vh;
}

@keyframes vibrate {
  0%, 2%, 4%, 6%, 8%, 10%, 12%, 14%, 16%, 18% {
    -webkit-transform: translate3d(-1px, 0, 0);
            transform: translate3d(-1px, 0, 0);
  }
  1%, 3%, 5%, 7%, 9%, 11%, 13%, 15%, 17%, 19% {
    -webkit-transform: translate3d(1px, 0, 0);
            transform: translate3d(1px, 0, 0);
  }
  20%, 100% {
    -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
  }
}

svg {
  height: 70%;
  float: left;
  padding: 1vh;
  &.vibrate {
    -webkit-animation: vibrate 5s cubic-bezier(.36, .07, .19, .97) infinite;
    animation: vibrate 5s cubic-bezier(.36, .07, .19, .97) infinite;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-perspective: 300px;
    perspective: 300px;
  }
}

.notifications {
  float: right;
  margin-right: 8px;
}

span {
  background-color: themeRGBA("yellow", 0.7);
  padding: 3px;
  color: black;
  border-radius: 50%;
}

.caution-text {
  color: black;
}

.menu-item {
  height: 15%;
  max-height: 45px;
  background-color: themeRGBA("darkBlue", 0.9);
  cursor: default;
  &:hover {
    background-color: lighten(themeRGBA("darkBlue", 1), 20%);
  }
}

.caution {
    background-color: themeRGBA("yellow", 0.9) !important;
    &:hover {
      background-color: lighten(themeRGBA("yellow", 1), 20%) !important;
    }
  }

.get-the-app {
    background-color: themeRGBA("green", 0.9) !important;
    color: black !important;
    &:hover {
      background-color: lighten(themeRGBA("green", 1), 20%) !important;
    }
}

.get-the-app-text {
  color: black;
}


.user-items {
  display: inline;
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

p {
  margin-bottom: 0;
  margin-top: 0;
  margin-right: 0;
  margin-left: 2%;
  padding-top: 1%;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color: lighten(getColor("darkBlue"), 50%);
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
      p {
        font-size: 3vh;
        text-align: center;
      }
      .menu-icon-container {
        right: 1%;
      }
      .top-item {
        margin-left: auto;
        margin-right: auto;
        width: 35%;
      }
      .menu-item {
      padding-top: 1vh;
      }
}

.topnav {
  background-color: themeRGBA("grey", 0.5);
  height: 5vh;
  min-height: 40px;
  max-height: 50px;
  width: 100%;
  overflow: visible;
}

.currentDate {
    background-color: #ddd; 
    color: black !important;
    cursor: auto;
}

.router-link-active {
    background-color: getColor("green");
    color: white;
    padding: 0;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 1.87vh 2vw 0.9vh 2vw;
  text-decoration: none;
  font-size: 1.8vh;
  font-weight: bold;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}
</style>
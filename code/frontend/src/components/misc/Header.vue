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
              @click="activeMenu = !activeMenu" 
              :class="`menu-icon-container ${activeMenu ? 'active-menu' : ''}`"
            >
            <button class="get-the-app blue" @click="downloadApp()">
              <p class="get-the-app-text">Get the App</p>
            </button>
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
                <div class="menu-item" @click="redirect('/institutionAdmin')">
                  <p v-if="_.authRequirementsSatisfied(2)">
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
              <div class="menu-item" @click="redirect('/user/notifications')">
                <p>
                  Notifications
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
        notifications: ['hey there', 'buddy', 'yeah']
      }
    },
    methods: {
      downloadApp() {
        this._.alert(`This feature is coming soon insha'Allah!`)
      },
      redirect(path) {
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
      }
    },
    computed: {
      notificationNum() {
        return this.notifications.length
      },
      loggedIn() {
        return this.$store.getters.tokenExists
      },
      userInfo() {
        return this.$store.getters.decodedJWT
      }
    }
}
</script>

<style lang="scss" scoped>
img {
  height: 70%;
  float: left;
  padding: 1vh;
}

.caution {
  background-color: themeRGBA("yellow", 0.7) !important;
  &:hover {
    background-color: lighten(themeRGBA("yellow", 0.7), 20%) !important;
  }
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
  background-color: themeRGBA("darkBlue", 0.7);
  cursor: default;
  &:hover {
    background-color: lighten(themeRGBA("darkBlue", 0.7), 20%);
  }
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

.get-the-app {
  max-width: 120px;
  padding-top: 6px;
  position: relative;
  right: 5px;
}

.get-the-app-text {
  color: black;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  padding: 0;
}

@media screen and (max-width: $phoneWidth) {
      p {
        font-size: 3vh;
        text-align: center;
      }
      .menu-icon-container {
        right: 1%;
      }
      .get-the-app {
        width: 25%;
        font-weight: 500;
        right: 3%;
      }
      .get-the-app-text {
        font-size: 1.5vh;
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
  top: 0;
  height: 5vh;
  min-height: 40px;
  max-height: 50px;
  width: 100%;
  left: 0;
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
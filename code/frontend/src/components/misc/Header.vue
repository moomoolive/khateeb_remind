<template>
      <div class="topnav">
        <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
            @click="toHome()"
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
            <div v-show="activeMenu" class="menu-container">
              <div class="menu-item" @click="redirect('/khateeb/')"><p>Schedule</p></div>
              <div class="menu-item" @click="redirect('/khateeb/announcements')"><p>Announcements</p></div>
              <div class="menu-item" @click="redirect('/institutionAdmin/')">
                <p v-if="userInfo.__t !== 'khateeb'">Admin Central</p>
              </div>
              <div class="menu-item" @click="redirect('/user/profile')"><p>My Profile</p></div>
              <div class="menu-item" @click="redirect('/user/notifications')">
                <p>
                  Notifications 
                  <span v-if="notificationNum > 0">
                    {{ notificationNum }}
                  </span> 
                </p>
              </div>
              <div class="menu-item caution" @click="logout()"><p class="caution-text">Logout</p></div>
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
      redirect(path) {
        this.$router.push(path)
        this.activeMenu = false
      },
      signUp() {
        const info = {
          type: 'redirect',
          options: {
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
        const to = this.$store.getters.decodedJWT ? `/${this.$store.getters.decodedJWT.__t}/` : `/`
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

.menu-icon-container {
  position: relative;
  border-radius: 50%;
  height: 50%;
  right: 1%;
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

@media screen and (max-width: $phoneWidth) {
      p {
        font-size: 3vh;
        text-align: center;
      }
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
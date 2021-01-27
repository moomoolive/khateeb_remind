<template>
      <div class="topnav">
        <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
            @click="toHome()"
        >
        <div v-if="!loggedIn">
          <button class="blue" @click="toLogin()">Log In</button>
          <button class="green" @click="signUp()">Sign Up</button>
        </div>
        <!-- <a class="currentDate" style="float: right; ">
          {{ abbreviatedDayOfWeek }} {{ abbreviatedMonthName }} {{ currentDate }}, {{ abbreviatedYear }}
        </a> -->
      </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
      return {
        currentDate: '',
        abbreviatedMonthName: '',
        abbreviatedDayOfWeek: '',
        abbreviatedYear: '',
        loggedIn: this.$store.getters.tokenExists
      }
    },
    methods: {
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
      }
    },
    created() {
      const x = new Date()
      this.currentDate = x.getDate()
      this.abbreviatedMonthName = x.toLocaleString('default', { month: 'short' })
      this.abbreviatedDayOfWeek = x.toLocaleString('default', { weekday: 'short' })
      this.abbreviatedYear = `'${x.getFullYear() - 2_000}`
    }
}
</script>

<style lang="scss" scoped>
img {
  height: 70%;
  float: left;
  padding: 1vh;
}

button {
  float: right;
  font-size: 1vh;
  font-weight: bold;
  border-radius: 0;
  color: black;
  height: 60%;
  width: 10vh;
  margin-left: 0;
}

.topnav {
  background-color: themeRGBA("grey", 0.5);
  top: 0;
  height: 5vh;
  max-height: 50px;
  width: 100%;
  left: 0;
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